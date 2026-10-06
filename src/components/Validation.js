import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ValidationReport from './ValidationReport';

import getValidationById from '../api/getValidationById';

import DocumentInfo from './DocumentInfo';
import Loading from './Loading';
import PageTitle from './PageTitle';
import ValidationProperties from './ValidationProperties';

// statuses that won't change without an action of the user : no more polling
const STATUS_COMPLETED = ['finished', 'error', 'archived', 'waiting_for_args'];

// delays between two refreshes of a validation in progress (the last one is repeated)
export const POLLING_DELAYS = [1000, 2000, 3000, 5000, 10000];

function Validation() {
    const { uid } = useParams();
    const [validation, setValidation] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        let timeoutId = null;
        // number of refreshes with the same status (increases the delay)
        let attempt = 0;
        let lastStatus = null;
        // refresh postponed while the page is hidden
        let postponed = false;

        function schedule() {
            if (document.hidden) {
                postponed = true;
                return;
            }
            const delay = POLLING_DELAYS[Math.min(attempt, POLLING_DELAYS.length - 1)];
            attempt++;
            timeoutId = setTimeout(updateData, delay);
        }

        function updateData() {
            timeoutId = null;
            getValidationById(uid).then((data) => {
                if (cancelled) return;
                if (data.status !== lastStatus) {
                    lastStatus = data.status;
                    attempt = 0;
                }
                if (!STATUS_COMPLETED.includes(data.status)) {
                    schedule();
                }
                setValidation(data);
            }).catch((err) => {
                if (cancelled) return;
                console.error(err);
                setError(err);
            });
        }

        function onVisibilityChange() {
            if (document.hidden) {
                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                    postponed = true;
                }
            } else if (postponed) {
                postponed = false;
                updateData();
            }
        }

        document.addEventListener('visibilitychange', onVisibilityChange);
        updateData();

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
            document.removeEventListener('visibilitychange', onVisibilityChange);
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
        return <Loading />;
    }

    return (
        <div className="container-content">
            <PageTitle title={"Validation de " + validation.dataset_name} />
            <div className="container-content">
                <ValidationProperties validation={validation} />
                <DocumentInfo documentInfo={validation.document_info} />
                <ValidationReport validation={validation} />
            </div>
        </div>
    )
}

export default Validation;