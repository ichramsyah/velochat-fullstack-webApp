import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const AddContactButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="bg-[#6363FC] w-14 h-14 rounded-[60px] hover:rounded-[10px] cursor-pointer transition-all">
      <FontAwesomeIcon icon={faUserPlus} className="text-white text-[18px] ml-1 " />
    </button>
  );
};

export default AddContactButton;
