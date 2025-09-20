import proshootaiLogo from '/proshootai-dark-mode.svg';
import { Link } from 'react-router';

const Logo = ({ link = '/' }: { link: string }) => {
  return (
    <div>
      <Link to={link}>
        <img
          src={proshootaiLogo}
          alt="proshootai logo"
          className="w-8"
          draggable="false"
        />
      </Link>
    </div>
  );
};

export default Logo;
