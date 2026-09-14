import React from 'react';
import { marked } from 'marked';
import PageTitle from './PageTitle';
import aboutContent from '../data/about.md';
import './About.css';

// Render blockquotes ("> ...") as bootstrap warning callouts, matching the demo's style.
const renderer = new marked.Renderer();
renderer.blockquote = ({ tokens }) => `<p class="alert alert-warning" role="alert">${marked.parser(tokens).replace(/^<p>|<\/p>\n?$/g, '')}</p>`;

const aboutHtml = marked.parse(aboutContent, { renderer });

/**
 * Page providing informations, content editable in src/data/about.md
 */
class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main className="main" role="main" tabIndex="-1">
                <PageTitle title="A propos"/>
                <div className="container-content">
                    <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: aboutHtml }} />
                </div>
            </main>
        )
    }
}

export default About;
