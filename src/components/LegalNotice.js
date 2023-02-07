import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import legalContent from '../data/content/legal.md';
import PageTitle from './PageTitle';

/**
 * Page providing informations
 */
class LegalNotice extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const url = "demo-validator.ign.fr";

        return (
            <main className="main" role="main" tabIndex="-1">
                <PageTitle title="Mentions légales"/>
                <div className="container-content container-content--smaller">
                    <ReactMarkdown
                        children={legalContent.replace(/{url}/g, url)}
                        className="wysiwyg" />
                </div>
            </main>
        )
    }
}

export default withRouter(LegalNotice);
