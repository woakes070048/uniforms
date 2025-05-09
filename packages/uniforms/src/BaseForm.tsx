import clone from 'lodash/clone';
import get from 'lodash/get';
import omit from 'lodash/omit';
import setWith from 'lodash/setWith';
import React, { Component, SyntheticEvent } from 'react';

import { Bridge } from './Bridge';
import { changedKeys } from './changedKeys';
import { context } from './context';
import { randomIds } from './randomIds';
import {
  ChangedMap,
  Context,
  ModelTransformMode,
  UnknownObject,
} from './types';

export type BaseFormProps<Model extends UnknownObject> = {
  autosave: boolean;
  autosaveDelay: number;
  children?: React.ReactNode;
  disabled?: boolean;
  error: unknown;
  id?: string;
  model: Model;
  modelTransform?: (mode: ModelTransformMode, model: Model) => Model;
  noValidate: boolean;
  onChange?: (key: string, value: unknown) => void;
  onSubmit: (model: Model) => void | Promise<unknown>;
  readOnly?: boolean;
  schema: Bridge;
  showInlineError?: boolean;
};

export type BaseFormState<Model extends UnknownObject> = {
  changed: boolean;
  changedMap: ChangedMap<Model>;
  resetCount: number;
  submitting: boolean;
  submitted: boolean;
};

export class BaseForm<
  Model extends UnknownObject,
  Props extends BaseFormProps<Model> = BaseFormProps<Model>,
  State extends BaseFormState<Model> = BaseFormState<Model>,
> extends Component<Props, State> {
  static displayName = 'Form';
  static defaultProps = {
    autosave: false,
    autosaveDelay: 0,
    error: null,
    model: Object.create(null),
    noValidate: true,
    onSubmit() {},
  };

  constructor(props: Props) {
    super(props);

    // @ts-expect-error: State may be bigger, but it'll be covered by the subclasses.
    this.state = {
      changed: false,
      changedMap: Object.create(null),
      resetCount: 0,
      submitted: false,
      submitting: false,
    };

    this.mounted = false;
    this.randomId = randomIds(this.props.id);

    this.onReset = this.reset = this.onReset.bind(this);
    this.onChange = this.change = this.onChange.bind(this);
    this.onSubmit = this.submit = this.onSubmit.bind(this);

    // TODO: It shouldn't be here
    const getModel = this.getModel.bind(this);
    this.getModel = (mode, model = getModel(mode)) =>
      mode !== undefined && this.props.modelTransform
        ? this.props.modelTransform(mode, model)
        : model;
  }

  componentDidMount() {
    this.mounted = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidUpdate(prevProps: Props, prevState: State, snapshot: never) {}

  componentWillUnmount() {
    this.mounted = false;
    if (this.delayId) {
      clearTimeout(this.delayId);
    }
  }

  delayId?: ReturnType<typeof setTimeout> | undefined;
  mounted: boolean;
  reset: () => void;
  change: (key: string, value: unknown) => void;
  submit: (event?: SyntheticEvent) => Promise<unknown>;
  randomId: () => string;

  getContext(): Context<Model> {
    return {
      changed: this.state.changed,
      changedMap: this.state.changedMap,
      error: this.getContextError(),
      formRef: this,
      model: this.getContextModel(),
      name: this.getContextName(),
      onChange: this.getContextOnChange(),
      onSubmit: this.getContextOnSubmit(),
      randomId: this.randomId,
      schema: this.getContextSchema(),
      state: this.getContextState(),
      submitted: this.state.submitted,
      submitting: this.state.submitting,
      validating: false,
    };
  }

  getContextName(): Context<Model>['name'] {
    return [];
  }

  getContextError(): Context<Model>['error'] {
    return this.props.error;
  }

  getContextModel(): Context<Model>['model'] {
    return this.getModel('form');
  }

  getContextState(): Context<Model>['state'] {
    return {
      disabled: !!this.props.disabled,
      readOnly: !!this.props.readOnly,
      showInlineError: !!this.props.showInlineError,
    };
  }

  getContextSchema(): Context<Model>['schema'] {
    return this.props.schema;
  }

  getContextOnChange(): Context<Model>['onChange'] {
    // It's bound in constructor.
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return this.onChange;
  }

  getContextOnSubmit(): Context<Model>['onSubmit'] {
    // It's bound in constructor.
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return this.onSubmit;
  }

  getModel(
    mode?: ModelTransformMode,
    model: Model = this.props.model,
  ): Context<Model>['model'] {
    return model;
  }

  getNativeFormProps(): {
    [key: string]: unknown;
    children?: React.ReactNode;
    id?: string;
    key: string;
    noValidate: boolean;
    onSubmit: BaseForm<Model, Props, State>['onSubmit'];
  } {
    const props = omit(this.props, [
      'autosave',
      'autosaveDelay',
      'disabled',
      'error',
      'model',
      'modelTransform',
      'onChange',
      'onSubmit',
      'readOnly',
      'schema',
      'showInlineError',
    ]);

    return {
      ...props,
      // It's bound in constructor.
      // eslint-disable-next-line @typescript-eslint/unbound-method
      onSubmit: this.onSubmit,
      key: `reset-${this.state.resetCount}`,
    };
  }

  onChange(key: string, value: unknown) {
    // Do not set `changed` before componentDidMount
    if (this.mounted) {
      const keys = changedKeys(key, value, get(this.getModel(), key));
      if (keys.length !== 0) {
        this.setState(state =>
          // If all are already marked, we can skip the update completely.
          state.changed && keys.every(key => !!get(state.changedMap, key))
            ? null
            : {
                changed: true,
                changedMap: keys.reduce(
                  (changedMap, key) => setWith(changedMap, key, {}, clone),
                  clone(state.changedMap),
                ),
              },
        );
      }
    }

    if (this.props.onChange) {
      this.props.onChange(key, value);
    }

    // Do not call `onSubmit` before componentDidMount
    if (this.mounted && this.props.autosave) {
      if (this.delayId) {
        clearTimeout(this.delayId);
      }

      // Delay autosave by `autosaveDelay` milliseconds...
      this.delayId = setTimeout(() => {
        // ...and wait for all scheduled `setState`s to commit. This is required
        // for AutoForm to validate correct model, waiting in `onChange`.
        if (this.mounted) {
          this.setState(
            () => null,
            () => {
              this.onSubmit();
            },
          );
        }
      }, this.props.autosaveDelay);
    }
  }

  __reset(state: State) {
    return {
      changed: false,
      changedMap: Object.create(null),
      resetCount: state.resetCount + 1,
      submitted: false,
      submitting: false,
    } as Partial<State>;
  }

  onReset() {
    if (this.mounted) {
      // @ts-expect-error
      // It's bound in constructor.
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.setState(this.__reset);
    }
  }

  onSubmit(event?: SyntheticEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.mounted) {
      this.setState(state => (state.submitted ? null : { submitted: true }));
    }

    const result = this.props.onSubmit(this.getModel('submit'));
    if (!(result instanceof Promise)) {
      return Promise.resolve();
    }

    if (this.mounted) {
      this.setState({ submitting: true });
    }

    return result.finally(() => {
      if (this.mounted) {
        this.setState({ submitting: false });
      }
    });
  }

  render() {
    return (
      <context.Provider value={this.getContext()}>
        <form {...this.getNativeFormProps()} />
      </context.Provider>
    );
  }
}
