import React, {useContext, useState, useEffect} from 'react'
import axios from 'axios';

import AuthenticationContext from '../../components/auth/AuthenticationContext';

import Shelter from '../../components/OnboardingWizard/widgets/Shelter/Shelter'
import Subscriptions from '../../components/OnboardingWizard/widgets/Subscriptions/Subscriptions'
import Transportation from '../../components/OnboardingWizard/widgets/Transportation/Transportation'
import Utilities from '../../components/OnboardingWizard/widgets/Utilities/Utilities'
import CreditCardBills from '../../components/OnboardingWizard/widgets/CreditCardBills/CreditCardBills'
import OtherAssets from '../../components/OnboardingWizard/widgets/OtherAssets/OtherAssets'

import CSV from "../../components/AssetBudget/CSV"
import AssetPlaid from "../../components/AssetBudget/AssetPlaid"
import TransactionPlaid from "../../components/AssetBudget/TransactionPlaid"

import './OnboardingWizard.css'

export default function OnboardingWizard() {

    const {id} = useContext(AuthenticationContext)
    const [addStatus, setAddStatus] = useState(0)

    useEffect(() => {
        setAddStatus(0)
    }, [addStatus])

    return (
        <div className='onboard-body'>
            <div className='onboard-container'>
                <h1 className='onboard-heading'>Welcome to CanBudget!</h1>
                <p className='onboard-heading-body'>We are here to help you start planning your financial future.</p>
                <div className='onboard-button-container'>
                    <TransactionPlaid id= {id} setAddStatus = {setAddStatus} > </TransactionPlaid>
                    <CSV id= {id} setAddStatus = {setAddStatus} > </CSV>
                    <AssetPlaid id= {id} setAddStatus = {setAddStatus} > </AssetPlaid>
                </div>
            </div>
            <Shelter sendDataToOnboard={(data) => {addNewBalanceSheet(data, id)}}/>
            <Transportation sendDataToOnboard={(data) => {addNewBalanceSheet(data, id)}}/>
            <Subscriptions sendDataToOnboard={(data) => {addNewBalanceSheet(data, id)}}/>
            <Utilities sendDataToOnboard={(data) => {addNewBalanceSheet(data, id)}}/>
            <CreditCardBills sendDataToOnboard={(data) => {addNewBalanceSheet(data, id)}}/>
            <OtherAssets sendDataToOnboard={(data) => {addNewBalanceSheet(data, id)}}/>
        </div>
    )

    async function addNewBalanceSheet(event, id) {
        console.log(event, id)
        for (let i in event.answers) {
            console.log(event.answers[i])
        }
        // let {data} = await axios.patch(`/api/user/${id}/addBalanceSheet/`, newBalanceSheet, {headers : {"Content-Type": "application/json"}})
        // if (data.ok) {
        //     setAddStatus(data.ok)
        // }
    }
}
