import React from 'react';

class StatusBadge extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var badgeClass = "badge ";
        var badgeText = "";
        switch (this.props.status) {
            case "waiting_for_args":
                badgeClass += "badge-warning";
                badgeText = "En attente de paramètres";
                break;
            case "uploadable":
                badgeClass += "badge-primary";
                badgeText = "En attente de l'API : transfert";
                break;
            case "patchable":
                badgeClass += "badge-primary";
                badgeText = "En cours de l'API : attente";
                break;
            case "waiting_valid":
                badgeClass += "badge-primary";
                badgeText = "Traitement API : en cours";
                break;
            case "validated":
                badgeClass += "badge-success";
                badgeText = "Terminée";
                break;
            case "error":
                badgeClass += "badge-danger";
                badgeText = "En erreur";
                break;
            case "archived":
                badgeClass += "badge-secondary";
                badgeText = "Archivée";
                break;
        }
        return (
            <span className={badgeClass}>
                {badgeText}
            </span>
        )
    }
}

export default StatusBadge;