
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import * as styles from './LayoutWithNavbar.css';

const LayoutWithNavbar = () => {
  return (
    <>
      <Navbar />
      <div className={styles.content}>
        {' '}
        <Outlet />
      </div>
    </>
  );
};

export default LayoutWithNavbar;