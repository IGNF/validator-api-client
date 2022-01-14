import React from 'react';

import { Link } from 'react-router-dom';

class Footer extends React.Component {
    render() {
        const year = new Date().getFullYear();
        return (
            <div className="footer pt-0">
                <div className="container-content">
                    <div className="region region-post-footer">
                        <footer id="block-portalpostfooterblock" className="footer-contentinfo block block-ign-common block-block-portal-postfooter" role="contentinfo">
                            <p className="footer-copyright">&copy; IGN - {year}</p>
                            <ul className="footer-list footer-list--inline">
                                <li className="footer-list-item">
                                    <Link to="/legal-notice" >Mentions légales</Link>
                                </li>
                                <li className="footer-list-item">
                                    <a href="https://github.com/IGNF/validator-api" target="_blank">Code source</a>
                                </li>
                            </ul>
                        </footer>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer;