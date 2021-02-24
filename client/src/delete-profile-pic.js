import axios from "./axios";

export default function DeleteProfilePic(props) {
    // console.log("props: ", props);

    const submit = () => {
        console.log("delete here", props.deletePic);

        axios
            .post(`/delete-profile-pic`)
            .then(({ data }) => {
                console.log("data: ", data.rows[0].profile_pic_url);
                props.deletePic(data.rows[0].profile_pic_url);
            })
            .catch((err) => {
                console.log("err in submit pic: ", err);
            });
    };

    return (
        <div className="delete-profile">
            <button className="delete-profile-pic" onClick={() => submit()}>
                delete
            </button>
        </div>
    );
}
