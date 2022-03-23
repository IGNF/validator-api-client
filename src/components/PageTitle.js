import React from 'react';

class PageTitle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header className="o-page-title ">
                <div className="o-page-title__inner">
                    <div className="container-content container-content--smaller">
                        <h1>{this.props.title}</h1>
                    </div>
                </div>
            </header>
        )
    }
}

export default PageTitle;