import Link from "next/link";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <span>
        <Link href="/" passHref>
          <a className={styles.footerLink}>
            <span className={styles.rb_p}>
              <div className={styles.footerLabel}>&#8962;</div>
            </span>
          </a>
        </Link>
      </span>
    </div>
  );
}
