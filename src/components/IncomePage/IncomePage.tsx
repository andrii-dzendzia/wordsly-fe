import React, { ChangeEvent, useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { getIncome, getPrice, setPrice } from '../../api/income';
import { languagesSelectors } from '../../store/language';
import { Income } from '../../types';
import { Header } from '../Header/Header';
import './IncomePage.scss';

export const IncomePage: React.FC = () => {
  const handleError = useErrorHandler();
  const languages = useSelector(languagesSelectors.getLanguages);
  const [income, setIncome] = useState<Income | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState(0);
  const [targetLanguage, setTargetLanguage] = useState(0);
  const [userPrice, setUserPrice] = useState('0');
  const [translatorPrice, setTranslatorPrice] = useState('0');

  useEffect(() => {
    (async () => {
      try {
        const newIncome = await getIncome();

        setIncome(newIncome);
      } catch (error) {
        handleError(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!sourceLanguage === !targetLanguage) {
        try {
          const newPrice = await getPrice(sourceLanguage, targetLanguage);

          setUserPrice(newPrice.pricePerUnitInput.toString());
          setTranslatorPrice(newPrice.pricePerUnitOutput.toString());
        } catch (error) {
          handleError(error);
        }
      }
    })();
  }, [sourceLanguage, targetLanguage]);

  const handleSourceLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = +event.target.value;

    setSourceLanguage(value);
  };

  const handleTargetLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = +event.target.value;

    setTargetLanguage(value);
  };

  const handleUserPrice = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setUserPrice(value.replace(/[^0-9]/g, ''));
  };

  const handleTranslatorPrice = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTranslatorPrice(value.replace(/[^0-9]/g, ''));
  };

  const handleUpdate = async () => {
    if (!sourceLanguage === !targetLanguage && +userPrice && +translatorPrice) {
      try {
        await setPrice(+userPrice, +translatorPrice, sourceLanguage, targetLanguage);
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <div>
      <div className="income__header">
        <Header />
      </div>

      <div className="income__container">
        <div className="income__projects-info has-text-white has-text-weight-light">
          <div className="income__projects-info-data">
            <p className="is-size-1">{`${income?.totalIncome}$`}</p>
            <p className="is-size-3"> total income</p>
          </div>

          <div className="income__projects-info-data">
            <p className="is-size-1">{`${income?.totalPayments}$`}</p>
            <p className="is-size-3">payments to translators</p>
          </div>

          <div className="income__projects-info-data">
            <p className="is-size-1">{`${income?.income}$`}</p>
            <p className="is-size-3">profit</p>
          </div>
        </div>

        <h2 className="income__personal-info-title has-text-centered has-text-white has-text-weight-light is-size-3">
          Pricing
        </h2>

        <div className="income__pricing">
          <label
            htmlFor="sourceLanguage"
            className="has-text-white has-text-weight-light is-size-4"
          >
            Source language:

            <div className="control">
              <div className="income__language-select select is-rounded is-medium">
                <select
                  id="sourceLanguage"
                  value={sourceLanguage}
                  onChange={handleSourceLanguage}
                  className="income__select has-text-weight-light"
                >
                  <option value={0}>All</option>
                  {languages.map(language => (
                    <option
                      key={language.id}
                      value={language.id}
                    >
                      {language.language}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </label>

          <label
            htmlFor="outputLanguage"
            className="has-text-white has-text-weight-light is-size-4"
          >
            Target language:

            <div className="control">
              <div className="income__language-select select is-rounded is-medium">
                <select
                  id="outputLanguage"
                  value={targetLanguage}
                  onChange={handleTargetLanguage}
                  className="income__select has-text-weight-light"
                >
                  <option value={0}>All</option>
                  {languages
                    .filter(language => language.id !== sourceLanguage)
                    .map(language => (
                      <option
                        key={language.id}
                        value={language.id}
                      >
                        {language.language}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </label>

          <label
            htmlFor="userPrice"
            className="has-text-white has-text-weight-light is-size-4"
          >
            Price per word for customer

            <div className="control">
              <input
                id="userPrice"
                type="text"
                value={userPrice}
                onChange={handleUserPrice}
                className="income__input input is-rounded has-text-weight-light is-medium"
              />
            </div>
          </label>

          <label
            htmlFor="translatorPrice"
            className="has-text-white has-text-weight-light is-size-4"
          >
            Price per word for translator

            <div className="control">
              <input
                id="translatorPrice"
                type="text"
                value={translatorPrice}
                onChange={handleTranslatorPrice}
                className="income__input input is-rounded has-text-weight-light is-medium"
              />
            </div>
          </label>
        </div>

        <div className="income__button-container">
          <button
            type="button"
            onClick={handleUpdate}
            className="income__update button is-rounded is-medium"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};
