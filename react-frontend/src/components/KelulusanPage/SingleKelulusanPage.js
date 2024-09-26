import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../services/restClient";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import ProjectLayout from "../Layouts/ProjectLayout";


const SingleKelulusanPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    const [latihan, setLatihan] = useState([]);
const [pelulus, setPelulus] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("kelulusan")
            .get(urlParams.singleKelulusanId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"latihan","pelulus"] }})
            .then((res) => {
                set_entity(res || {});
                const latihan = Array.isArray(res.latihan)
            ? res.latihan.map((elem) => ({ _id: elem._id, tajuk: elem.tajuk }))
            : res.latihan
                ? [{ _id: res.latihan._id, tajuk: res.latihan.tajuk }]
                : [];
        setLatihan(latihan);
const pelulus = Array.isArray(res.pelulus)
            ? res.pelulus.map((elem) => ({ _id: elem._id, name: elem.name }))
            : res.pelulus
                ? [{ _id: res.pelulus._id, name: res.pelulus.name }]
                : [];
        setPelulus(pelulus);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Kelulusan", type: "error", message: error.message || "Failed get kelulusan" });
            });
    }, [props,urlParams.singleKelulusanId]);


    const goBack = () => {
        navigate("/kelulusan");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Kelulusan</h3>
                </div>
                <p>kelulusan/{urlParams.singleKelulusanId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Status</label><p className="m-0 ml-3" >{_entity?.status}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Komen</label><p className="m-0 ml-3" >{_entity?.komen}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm">Latihan </label>
                    {latihan.map((elem) => (
                        <Link key={elem._id} to={`/latihan/${elem._id}`}>
                            <div className="card">
                                <p className="text-xl text-primary">{elem.tajuk}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm">Pelulus</label>
                    {pelulus.map((elem) => (
                        <Link key={elem._id} to={`/pelulus/${elem._id}`}>
                            <div className="card">
                                <p className="text-xl text-primary">{elem.name}</p>
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

export default connect(mapState, mapDispatch)(SingleKelulusanPage);
