import classNames from 'classnames';
import React from 'react';

import { Heading } from '../../components/Heading';
import { Oval } from '../../components/Oval';
import { Subtitle } from '../../components/Subtitle';
import styles from '../../css/index.module.css';

export function WhyUs() {
  return (
    <div
      className={classNames(
        'hero hero--primary',
        styles['overflow-hidden'],
        styles.whyus,
      )}
    >
      <div className="container">
        <div className="section">
          <div className="row">
            <div
              className={classNames('col col--5', styles['section-content'])}
            >
              <Subtitle>Why choose us</Subtitle>
              <Heading className={styles['heading-white']}>
                Easy and ready
                <br />
                to implement solution
              </Heading>
              <p className={classNames(styles.text, styles.paragraph)}>
                A set of open-source libraries capable of instantly generating
                any given form in React.
              </p>
              <h2 className={classNames(styles.text, styles.emphasis)}>
                Carried out by the global community of 50+ developers.
              </h2>
              <p className={classNames(styles.text, styles.paragraph)}>
                Focused on providing a ready-to-implement solution, and
                effortless development experience. Keeps your code simple.
              </p>
            </div>
            <div
              className={classNames(
                'col',
                styles['section-content'],
                styles['section-bgwhite'],
              )}
            >
              <span
                className={classNames(
                  styles['section-bgwhite-block'],
                  styles['section-bgwhite-block-right'],
                )}
              />
              <div className={classNames('row', styles.padding)}>
                <div className="col">
                  <Oval className={styles.white}>
                    <img
                      alt=""
                      src="img/icon-01.svg"
                      className={styles['small-image']}
                    />
                  </Oval>
                  <h2 className={styles['section-heading']}>
                    Integrations with various schemas:
                  </h2>
                  <ul>
                    <li>JSON Schema</li>
                    <li>GraphQL</li>
                    <li>SimpleSchema</li>
                    <li>SimpleSchema2</li>
                    <li>Zod</li>
                    <li>And any other - only a small wrapper is needed!</li>
                  </ul>
                </div>
                <div className="col">
                  <Oval className={styles.white}>
                    <img
                      alt=""
                      src="img/icon-02.svg"
                      className={styles['small-image']}
                    />
                  </Oval>
                  <h2 className={styles['section-heading']}>
                    Wide range of themes:
                  </h2>
                  <ul>
                    <li>AntD theme</li>
                    <li>Bootstrap4</li>
                    <li>Bootstrap5</li>
                    <li>MUI</li>
                    <li>Semantic UI</li>
                    <li>Plain HTML</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
