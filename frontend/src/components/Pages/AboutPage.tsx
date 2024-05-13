import React from 'react';
import { Trans } from "react-i18next";

import WastePicture from "images/about_waste.jpg";

/**
 * Content of the About page
 *
 * @returns {React.ReactElement} The about page
 */
const AboutPage = (): React.ReactElement => {
    return (
        <div id='about-container' className='text-center'>
            <div className='row'>
                <h4 className='about-title'><Trans i18nKey="about.title">A térképről</Trans></h4>
            </div>
            <hr className='about-hr hr-centered' />
            <div className='row row-cols-1 row-cols-xl-2'>
                <div className='col'>
                    <img src={WastePicture} alt='hulladék kupac' className='about-image'></img>
                </div>
                <div className='col'>
                    <p className='about-desc-title'><Trans i18nKey="about.desc1"></Trans></p>
                    <hr className='about-hr hr-centered' />
                    <p className='about-desc'><Trans i18nKey="about.desc2"></Trans></p>
                    <p className='about-desc'><Trans i18nKey="about.desc3"></Trans></p>
                </div>
            </div>
            <div className='row row-cols-1 row-cols-lg-4 about-desc-cols'>
                <div className='col about-col'>
                    <p className='about-col-title'><Trans i18nKey="about.col1_title"></Trans></p>
                    <p>
                        <Trans i18nKey="about.col1_desc1"></Trans>
                        <a href="https://www.trashout.ngo/hu" target='_blank' rel="noreferrer">
                            <Trans i18nKey="about.col1_link"></Trans>
                        </a>
                        <Trans i18nKey="about.col1_desc2"></Trans>
                    </p>
                </div>
                <div className='col about-col'>
                    <p className='about-col-title'><Trans i18nKey="about.col2_title"></Trans></p>
                    <p>
                        <a href="https://tisztatiszaterkep.hu/docs/TrashOut-hasznalati-utmutato-a-PET-Kupa-versenyeken_2020_04_29.pdf" target='_blank' rel="noreferrer">
                            <Trans i18nKey="about.col2_link"></Trans>
                        </a>
                    </p>
                </div>
                <div className='col about-col'>
                    <p className='about-col-title'><Trans i18nKey="about.col3_title"></Trans></p>
                    <p>
                        <a href="https://petkupa.hu/hu_HU/kornyezetvedelem/monitoring" target='_blank' rel="noreferrer">
                            <Trans i18nKey="about.col3_link"></Trans>
                        </a>
                    </p>
                </div>
            </div>
            <div className='row'>
                <div className='col'>
                    <p>
                        <Trans i18nKey="about.note1"></Trans>
                        <a href="https://petkupa.hu/hu_HU/boldogtisza" target='_blank' rel="noreferrer">
                            <Trans i18nKey="about.link1"></Trans>
                        </a>
                        <Trans i18nKey="about.note2"></Trans>
                        <a href="https://kszgysz.hu/" target='_blank' rel="noreferrer">
                            <Trans i18nKey="about.link2"></Trans>
                        </a>.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AboutPage;