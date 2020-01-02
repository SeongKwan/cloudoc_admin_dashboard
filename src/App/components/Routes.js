import React from 'react';
import { 
    Switch, 
    Route,
    Redirect
} from 'react-router-dom';
import ClinicalDB from '../../pages/ClinicalDB';
import CreateClinicaldb from '../../pages/CreateClinicaldb';
import DetailClinicaldb from '../../pages/DetailClinicaldb';
import Page404 from '../../pages/Page404';
import {
    BrowserView,
    // MobileView
} from "react-device-detect";
import CheckAuth from './CheckAuth';

const Routes = () => {
    return (
        <>
            {/* <MobileView>
                <Switch>
                <Route path="/404" component={Page404} />
                <Route path="/cloudoc/clinicaldb" component={ClinicalDBMobile} />
                <Route path={`/cloudoc/case/detail/:id/:index/:dateIndex`} component={CaseDetailMobile} />
                <Route path={`/cloudoc/case/create`} component={CaseCreateMobile} />
                <Route path="/cloudoc" exact component={MainMobile} />
                <Route component={Page404} />
                </Switch>
            </MobileView> */}
            <BrowserView>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/clinicaldb" />
                    </Route>
                    <Route exact path="/clinicaldb">
                        <ClinicalDB />
                    </Route>
                    <Route path="/clinicaldb/create">
                        <CreateClinicaldb />
                    </Route>
                    <Route path={`/clinicaldb/:section/:id`}>
                        <DetailClinicaldb />
                    </Route>
                    <Route>
                        <Page404 />
                    </Route>
                    
                </Switch>
            </BrowserView>
        </>
    );
};

export default CheckAuth()(Routes);