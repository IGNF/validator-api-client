import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PageTitle from './PageTitle';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkEmoji from 'remark-emoji';
import rehypeRaw from 'rehype-raw';
import aboutContent from '../data/content/about.md';

/**
 * Page providing informations
 */
class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main className="main" role="main" tabIndex="-1">
                <PageTitle title="A propos"/>
                <div className="container-content container-content--smaller">
                    <ReactMarkdown
                        children={aboutContent}
                        className="wysiwyg"
                        remarkPlugins={[gfm, remarkDirective, remarkEmoji]}
                        rehypePlugins={[rehypeRaw]} />
                </div>
            </main>
        )
    }
}

export default withRouter(About);
