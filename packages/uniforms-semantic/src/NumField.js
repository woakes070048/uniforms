import React          from 'react';
import classnames     from 'classnames';
import connectField   from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import {Component}    from 'react';

const noneIfNaN = x => isNaN(x) ? undefined : x;

const Num_ = ({
    className,
    decimal,
    disabled,
    error,
    errorMessage,
    icon,
    iconLeft,
    iconProps,
    id,
    inputRef,
    label,
    max,
    min,
    name,
    onChange,
    placeholder,
    required,
    showInlineError,
    step,
    value,
    ...props
}) =>
    <div className={classnames(className, {disabled, error, required}, 'field')} {...filterDOMProps(props)}>
        {label && (
            <label htmlFor={id}>
                {label}
            </label>
        )}

        <div className={classnames('ui', {left: iconLeft, icon: icon || iconLeft}, 'input')}>
            <input
                disabled={disabled}
                id={id}
                max={max}
                min={min}
                name={name}
                onChange={onChange}
                placeholder={placeholder}
                ref={inputRef}
                step={step || (decimal ? 0.01 : 1)}
                type="number"
                value={value}
            />

            {(icon || iconLeft) && (
                <i className={`${icon || iconLeft} icon`} {...iconProps} />
            )}
        </div>

        {!!(errorMessage && showInlineError) && (
            <div className="ui red basic pointing label">
                {errorMessage}
            </div>
        )}
    </div>
;

// TODO: Provide more generic solution.
class Num extends Component {
    constructor () {
        super(...arguments);

        this.state = {value: '' + this.props.value};

        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps ({decimal, value}) {
        const parse = decimal ? parseFloat : parseInt;

        if (noneIfNaN(parse(value)) !== noneIfNaN(parse(this.state.value.replace(/[\.,]+$/, '')))) {
            this.setState({value: value === undefined || value === '' ? '' : '' + value});
        }
    }

    onChange ({target: {value}}) {
        const change = value.replace(/[^\d\.,-]/g, '');
        const parsed = noneIfNaN((this.props.decimal ? parseFloat : parseInt)(change));

        this.setState(
            () => ({value: change}),
            () => this.props.onChange(parsed)
        );
    }

    render () {
        return Num_({...this.props, onChange: this.onChange, value: this.state.value});
    }
}

export default connectField(Num);
