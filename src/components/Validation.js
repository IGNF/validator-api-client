import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ValidationReport from './ValidationReport';

import getValidationById from '../api/getValidationById';

import PageTitle from './PageTitle';
import ValidationActions from './ValidationActions';
import ValidationProperties from './ValidationProperties';

const STATUS_COMPLETED = ['finished', 'error'];

function Validation() {
    const { uid } = useParams();
    const [validation, setValidation] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        let timeoutId;

        function updateData() {
            getValidationById(uid).then((data) => {
                if (cancelled) return;
                if (!STATUS_COMPLETED.includes(data.status)) {
                    timeoutId = setTimeout(updateData, 1000);
                }
                setValidation(data);
            }).catch((err) => {
                if (cancelled) return;
                console.log(err);
                setError(err);
            });
        }

        updateData();

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [uid]);

    if (error != null) {
        return (
            <div className="container-content pt-1">
                <div className="alert alert-danger">
                    {error.message}
                </div>
            </div>
        );
    }

    if (!validation.hasOwnProperty('arguments')) {
        return null
    }

    return (
        <div className="container-content">
            <PageTitle title={"Validation de " + validation.dataset_name} />
            <div className="container-content">
                <ValidationProperties validation={validation} />
                <ValidationActions validation={validation} />
                <ValidationReport validation={validation} />
            </div>
        </div>
    )
}

export default Validation;