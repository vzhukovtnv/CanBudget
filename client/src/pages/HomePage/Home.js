import React, { useEffect, useContext } from 'react';
import { useLocation } from "react-router-dom";
import { scroller } from 'react-scroll';

import InfoSection from '../../components/InfoSection/InfoSection';
import Greeting from '../../components/InfoSection/StatusLineMessage';

import Promotions from '../../components/Promotions/Promotions';
import OurTeam from '../../components/OurTeam/OurTeam';
import { homeObjOne } from './Data';
import { promotionData } from '../../components/Promotions/data';
import { memberData } from '../../components/OurTeam/data';
import AuthenticationContext from '../../components/auth/AuthenticationContext';

const Home = () => {

    const location = useLocation();
    const isLogedIn = useContext(AuthenticationContext).isLogedIn();

    const scrollTo = (targetEl) => {
        scroller.scrollTo(targetEl, {
            duration: 800,
            delay: 0,
            smooth: "easeInOutQuart",
            offset: -80
        });

    };


    useEffect(() => {
        let hash = location.hash.replace('#', '')
        if (hash.length) {
            scrollTo(hash);
        }

    }, [])

    return (
        <>
            <Greeting/>
            {!isLogedIn && <InfoSection  {...homeObjOne} />}
            < Promotions name='promotions' data={promotionData} />
            <OurTeam name='our-team' data={memberData} />
        </>
    )
};

export default Home;