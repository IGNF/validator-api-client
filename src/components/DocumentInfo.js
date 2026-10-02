import React from 'react';

/**
 * Affichage des informations extraites du document par le validateur
 * (document_info, produit uniquement si l'option "normalize" est activée)
 */
function DocumentInfo({ documentInfo }) {
    if (!documentInfo) {
        return null;
    }

    const title = documentInfo.metadata && documentInfo.metadata.title;
    const files = documentInfo.files || [];

    return (
        <div className="card mb-2">
            <div className="card-body">
                <h2 className="h5 card-title">Informations sur le document</h2>
                <table className="table table-sm">
                    <tbody>
                        <tr>
                            <td className="col-2">Nom</td>
                            <td>{documentInfo.name}</td>
                        </tr>
                        {documentInfo.documentModel && (
                            <tr>
                                <td>Modèle</td>
                                <td>{documentInfo.documentModel.name}</td>
                            </tr>
                        )}
                        {title && (
                            <tr>
                                <td>Titre</td>
                                <td>{title}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {files.length > 0 && (
                    <table className="table table-sm table-striped">
                        <thead>
                            <tr>
                                <th>Fichier</th>
                                <th>Type</th>
                                <th>Modèle de fichier</th>
                                <th className="text-right">Entités</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map((file) => (
                                <tr key={file.path}>
                                    <td>{file.path}</td>
                                    <td>{file.type}</td>
                                    <td>{file.modelName}</td>
                                    <td className="text-right">
                                        {file.totalFeatures === undefined ? '' : file.totalFeatures}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default DocumentInfo;
