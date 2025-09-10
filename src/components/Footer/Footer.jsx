import { getYear } from "date-fns";
import { TiSocialInstagram } from "react-icons/ti";
import { RiFacebookBoxFill } from "react-icons/ri";
import { ImTwitter, ImYoutube } from "react-icons/im";
import { FaLinkedin, FaGithub } from "react-icons/fa";

import { staticLinksFooter } from "./utils/getStaticLinks";
import styles from "./styles.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.containerFooter}>
        {/* Social Media Icons */}
        <div className={styles.socialIcons}>
          <RiFacebookBoxFill className={styles.socialIcon} />
          <TiSocialInstagram className={styles.socialIcon} />
          <ImTwitter className={styles.socialIcon} />
          <ImYoutube className={styles.socialIcon} />
        </div>

        {/* Footer Links */}
        <ul className={styles.footerLinks} role="list">
          {staticLinksFooter.map((item) => (
            <li key={item.id} role="listitem">
              <a href="#" className={styles.footerLink}>
                {item.title}
              </a>
            </li>
          ))}
        </ul>

        {/* Developer Credits Section */}
        <div className={styles.developerCredits}>
          <p className={styles.builtByLabel}>BUILT BY</p>
          <div className={styles.developers}>
            <div className={styles.developer}>
              <span className={styles.developerName}>Sana Mapkar</span>
              <div className={styles.developerSocials}>
                <a 
                  href="https://linkedin.com/in/sanamapkar/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.developerLink}
                >
                  <FaLinkedin />
                  <span>LinkedIn</span>
                </a>
                <a 
                  href="https://github.com/sana291518" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.developerLink}
                >
                  <FaGithub />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
            
            <div className={styles.developer}>
              <span className={styles.developerName}>Unnati Khane</span>
              <div className={styles.developerSocials}>
                <a 
                  href="https://linkedin.com/in/unnati-khane15/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.developerLink}
                >
                  <FaLinkedin />
                  <span>LinkedIn</span>
                </a>
                <a 
                  href="https://github.com/unnati1657" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.developerLink}
                >
                  <FaGithub />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Service Code and Copyright */}
        <div className={styles.footerBottom}>
          <p className={styles.serviceCode}>Service Code</p>
          <p className={styles.copyright}>© 1997-{getYear(new Date())} Netflix, Inc.</p>
        </div>
      </div>
    </footer>
  );
};
