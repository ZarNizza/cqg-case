import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import styles from "./CheckBtn.module.scss";

type Props = {
  text: string;
  checked: boolean;
  onClick: any;
};

export function CheckBtn(props: Props) {
  return (
    <label className={styles.rb}>
      <input
        type="checkbox"
        onChange={() => {}}
        onClick={props.onClick}
        className={styles.chk}
        hidden
        checked={props.checked}
      />
      <div className={styles.inputLabel}>{props.text}</div>
    </label>
  );
}
