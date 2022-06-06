import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import * as dropin from 'braintree-web-drop-in';
import { useErrorHandler } from 'react-error-boundary';
import { payment } from '../../api/payment';

type Props = {
  show: boolean;
  setShow: (show: boolean) => void;
  projectId: number;
  onPaymentComplete: () => void;
};

export const PaymentModal: React.FC<Props> = ({
  show,
  setShow,
  projectId,
  onPaymentComplete,
}) => {
  const handleError = useErrorHandler();
  const [braintreeInstance, setBraintreeInstance] = useState<dropin.Dropin>();

  useEffect(() => {
    if (show) {
      const initializeBraintree = () => dropin.create({
        authorization: 'sandbox_38sfybrb_v8s2m2wz66fvx7zx',
        container: '#braintree-drop-in-div',
      }, (error, instance) => {
        if (error) {
          handleError(error);
        } else {
          setBraintreeInstance(instance);
        }
      });

      if (braintreeInstance) {
        braintreeInstance
          .teardown()
          .then(() => {
            setBraintreeInstance(undefined);
            initializeBraintree();
          });
      } else {
        initializeBraintree();
      }
    }
  }, [show]);

  const handlePay = () => {
    if (braintreeInstance) {
      braintreeInstance.requestPaymentMethod(
        async (error, payload) => {
          if (error) {
            handleError(error);
          } else {
            const paymentMethodNonce = payload.nonce;

            try {
              await payment(projectId, paymentMethodNonce);
              onPaymentComplete();
            } catch (e) {
              handleError(e);
            }
          }
        },
      );
    }
  };

  return (
    <div className={classNames('modal', { 'is-active': show })}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Project payment</p>
          <button
            type="button"
            className="delete"
            aria-label="close"
            onClick={() => setShow(false)}
          >
          </button>
        </header>
        <section className="modal-card-body">
          <div id="braintree-drop-in-div"></div>
        </section>
        <footer className="modal-card-foot is-justify-content-flex-end">
          <button
            type="button"
            disabled={!braintreeInstance}
            onClick={handlePay}
            className="button is-dark is-outlined"
          >
            Pay
          </button>
        </footer>
      </div>
    </div>
  );
};
