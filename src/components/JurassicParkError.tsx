import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import JurassicParkGif from "../assets/ahahah.gif";
import JurassicParkAudio from "../assets/ahahah.m4a";

const JurassicParkError = ({ onClose }: { onClose: () => void }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const audio = new Audio(JurassicParkAudio);
        audio.play();

        const timer = setTimeout(() => {
            setShow(false);
            onClose();
        }, 4000); // Auto-close after 4 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!show) return null;

    return (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <img src={JurassicParkGif} alt="Ah Ah Ah!" width="300px" />
            <Alert severity="error">You don't have permission! <br /> Ah Ah Ah!</Alert>
        </div>
    );
};

export default JurassicParkError;
