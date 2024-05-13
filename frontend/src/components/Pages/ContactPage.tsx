import React from 'react'
import { Trans } from 'react-i18next';

import iibLogo from 'images/logos/IIB_logo.png'
import petLogo from 'images/logos/PET_logo_blue.png'
import termFilmLogo from 'images/logos/THU_logo.png'
import konaLogo from 'images/logos/KonaSoft_logo.png'
import tidyUpLogo from 'images/logos/TidyUP_logo.jpg'
import kszgyszLogo from 'images/logos/KSZGYSZ_logo.png'
import youTubeLogo from 'images/logos/youtube_icon.svg'
import facebookLogo from 'images/logos/facebook_icon.svg'
import instagramLogo from 'images/logos/instagram_icon.svg'

/**
 * Content of the contact page
 *
 * @returns {React.ReactElement} The contact page
 */
const ContactPage = (): React.ReactElement => {
    return (
            <div id='contact-container' className='text-center'>
                <div className='contact-row'>
                    <div className='row'>
                        <div className='col contact-title'>
                            <Trans i18nKey='contact.follow'>Kövess minket</Trans>
                        </div>
                    </div>
                        <hr className='contact-hr hr-centered hr-follow'/>
                    <div className='row row-cols-md-3 row-cols-1'>
                        <div className='col'>
                            <a className='contact-link contact-facebook' href='https://www.facebook.com/petkupa/' target='_blank' rel='noreferrer'>
                                <img src={facebookLogo} alt='Facebook' className='contact-img'/>
                            </a>
                        </div>
                        <div className='col'>
                            <a className='contact-link contact-instagram' href='https://www.instagram.com/petkupa/?hl=en' target='_blank' rel='noreferrer'>
                                <img src={instagramLogo} alt='Instagram' className='contact-img'/>
                            </a>
                        </div>
                        <div className='col'>
                            <a className='contact-link contact-youtube' href='https://www.youtube.com/c/PETKupa' target='_blank' rel='noreferrer'>
                                <img src={youTubeLogo} alt='Youtube' className='contact-img'/>
                            </a>
                        </div>
                    </div>
                </div>
                <div className='contact-row'>
                    <div className='row'>
                        <div className='col contact-title'><Trans i18nKey='contact.ideas'>A kezdeményezés ötletgazdái</Trans></div>
                    </div>
                    <hr className='contact-hr hr-centered hr-ideas'/>
                    <div className='row row-cols-md-2 row-cols-1'>
                        <div className='col'>
                            <a href='https://petkupa.hu/hu_HU/' target='_blank' rel='noreferrer'>
                                <img src={petLogo} alt='PETkupa' height={100} className='contact-img'/>
                            </a>
                        </div>
                        <div className='col'>
                            <a href='https://termeszetfilm.hu/' target='_blank' rel='noreferrer'>
                                <img src={termFilmLogo} alt='természetfilm.hu' height={100} className='contact-img'/>
                            </a>
                        </div>
                    </div>
                </div>
                <div className='contact-row'>
                    <div className='row'>
                        <div className='col contact-title'><Trans i18nKey='contact.sponsor'>Támogatóink</Trans></div>
                    </div>
                    <hr className='contact-hr hr-centered hr-support'/>
                    <div className='row row-cols-xl-4 row-cols-md-2 row-cols-1'>
                        <div className='col'>
                            <img src={tidyUpLogo} alt='TidyUp' height={80} className='contact-img'/>
                        </div>
                        <div className='col'>
                            <img src={kszgyszLogo} alt='KSZGYSZ' height={80} className='contact-img'/>
                        </div>
                        <div className='col'>
                            <img src={konaLogo} alt='KonaSoft' height={80} className='contact-img'/>
                        </div>
                        <div className='col'>
                            <img src={iibLogo} alt='IIB' height={80} className='contact-img'/>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default ContactPage;