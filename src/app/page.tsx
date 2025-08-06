import Image from "next/image";
import styles from "./page.module.css";
import { TextField } from "@mui/material";


export default function Home() {


  return (
    <div className={styles.page}>
      <TextField
        id="outlined-multiline-static"
        label="Multiline"
        multiline
        rows={4}
        defaultValue="Default Value"
      />
    </div>
  );
}
