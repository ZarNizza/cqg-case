import Logo from "./Logo";
import styles from "../styles/Home.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <Logo />
    </div>
  );
}
