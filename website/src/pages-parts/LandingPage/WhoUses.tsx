import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import classNames from 'classnames';
import React from 'react';

import { Button } from '../../components/Button';
import { Heading } from '../../components/Heading';
import { Subtitle } from '../../components/Subtitle';
import styles from '../../css/index.module.css';

export function WhoUses() {
  const context = useDocusaurusContext();
  const { companies, email } = context.siteConfig.customFields;

  return (
    <div
      className={classNames('hero hero--primary', styles['overflow-hidden'])}
    >
      <div className="container">
        <div className="section">
          <div className="row">
            <div
              className={classNames(
                'col',
                styles['section-content'],
                styles.logos,
              )}
            >
              <span
                className={classNames(
                  styles['section-bgwhite-block'],
                  styles['section-bgwhite-block-left'],
                )}
              />
              <div className={styles.grid3x3}>
                {/* FIXME: @docusaurus/* types. */}
                {(companies as any[]).map(({ image, url, alt }) => (
                  <a className={styles.item3x3} href={url} key={image}>
                    <img
                      alt={alt}
                      className={styles.company}
                      src={`assets/companies/${image}`}
                    />
                  </a>
                ))}
              </div>
            </div>
            <div
              className={classNames('col col--5', styles['section-content'])}
            >
              <Subtitle>References</Subtitle>
              <Heading className={styles['heading-white']}>
                Who uses uniforms
              </Heading>
              <p className={classNames(styles.text, styles.paragraph)}>
                Our package has been used in several projects worldwide. From
                small to the corporate business solutions and well-known
                enterprises. Companies trusted us in the development of both
                simple forms and sophisticated management systems.
              </p>
              <div className={styles['center-if-sm']}>
                <Button to={`mailto:${email}`}>Add your company</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
