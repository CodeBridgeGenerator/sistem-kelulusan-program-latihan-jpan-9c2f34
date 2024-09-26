import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../services/restClient";
import _ from "lodash";
import initilization from "../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const NotifyCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [latihan, setLatihan] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [latihan], setError);
        }
        set_entity({...init});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
        
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            latihan: _entity?.latihan?._id,venue: _entity?.venue,tarikh: _entity?.tarikh,pengajur: _entity?.pengajur,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("notify").create(_data);
        const eagerResult = await client
            .service("notify")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "latihan",
                    service : "latihan",
                    select:["tajuk"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Notify updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Notify" });
        }
        setLoading(false);
    };

    useEffect(() => {
                    // on mount latihan
                    client
                        .service("latihan")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleLatihanId } })
                        .then((res) => {
                            setLatihan(res.data.map((e) => { return { name: e['tajuk'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Latihan", type: "error", message: error.message || "Failed get latihan" });
                        });
                }, []);

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const latihanOptions = latihan.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Notify" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="notify-create-dialog-component">
            <div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="latihan">Latihan:</label>
                <Dropdown id="latihan" value={_entity?.latihan?._id} optionLabel="name" optionValue="value" options={latihanOptions} onChange={(e) => setValByKey("latihan", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["latihan"]) ? (
              <p className="m-0" key="error-latihan">
                {error["latihan"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="venue">Venue:</label>
                <InputText id="venue" className="w-full mb-3 p-inputtext-sm" value={_entity?.venue} onChange={(e) => setValByKey("venue", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["venue"]) ? (
              <p className="m-0" key="error-venue">
                {error["venue"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="tarikh">Tarikh:</label>
                undefined
            </span>
            <small className="p-error">
            {!_.isEmpty(error["tarikh"]) ? (
              <p className="m-0" key="error-tarikh">
                {error["tarikh"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="pengajur">Pengajur:</label>
                <InputText id="pengajur" className="w-full mb-3 p-inputtext-sm" value={_entity?.pengajur} onChange={(e) => setValByKey("pengajur", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["pengajur"]) ? (
              <p className="m-0" key="error-pengajur">
                {error["pengajur"]}
              </p>
            ) : null}
          </small>
            </div>
            <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(NotifyCreateDialogComponent);
