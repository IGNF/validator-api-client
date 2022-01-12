import React from 'react';

class PageTitle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header class="o-page-title ">
                <div class="o-page-title__inner">
                    <div class="container-content container-content--smaller">
                        <h1>{this.props.title}</h1>
                    </div>
                </div>
            </header>
        )
    }
}

export default PageTitle;