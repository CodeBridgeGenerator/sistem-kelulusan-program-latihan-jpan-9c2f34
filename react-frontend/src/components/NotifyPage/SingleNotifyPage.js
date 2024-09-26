import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../services/restClient";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import ProjectLayout from "../Layouts/ProjectLayout";


const SingleNotifyPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    const [latihan, setLatihan] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("notify")
            .get(urlParams.singleNotifyId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"latihan"] }})
            .then((res) => {
                set_entity(res || {});
                const latihan = Array.isArray(res.latihan)
            ? res.latihan.map((elem) => ({ _id: elem._id, tajuk: elem.tajuk }))
            : res.latihan
                ? [{ _id: res.latihan._id, tajuk: res.latihan.tajuk }]
                : [];
        setLatihan(latihan);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Notify", type: "error", message: error.message || "Failed get notify" });
            });
    }, [props,urlParams.singleNotifyId]);


    const goBack = () => {
        navigate("/notify");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Notify</h3>
                </div>
                <p>notify/{urlParams.singleNotifyId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Venue</label><p className="m-0 ml-3" >{_entity?.venue}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Pengajur</label><p className="m-0 ml-3" >{_entity?.pengajur}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm">Latihan</label>
                    {latihan.map((elem) => (
                        <Link key={elem._id} to={`/latihan/${elem._id}`}>
                            <div className="card">
                                <p className="text-xl text-primary">{elem.tajuk}</p>
                            </div>
                        </Link>
                    ))}</div>

                    <div className="col-12">&nbsp;</div>
                </div>
            </div>
        </div>
        
        </ProjectLayout>
    );
};

const mapState = (state) => {
    const { user, isLoggedIn } = state.auth;
    return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleNotifyPage);
