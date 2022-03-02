import styles from "./CheckBtn.module.scss";

type Props = {
  text: string;
  checked: boolean;
};

export function CheckBtn(props: Props) {
  return (
    <label className={styles.rb}>
      <input
        type="checkbox"
        onChange={() => {}}
        className={styles.chk}
        hidden
        checked={props.checked}
      />
      <div className={styles.inputLabel}>{props.text}</div>
    </label>
  );
}
