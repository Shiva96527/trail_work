import { toast } from "react-toastify";
import { getDropdownByTypeHTTP } from "../../services/global-service";

const useDropdownFilter = () => {
    // const [dropdownData, setDropdownData] = useState(null);

    const getDropdownByType = async (pay) => {
        const payload = { ...pay };
        payload['LoginUIID'] = sessionStorage.getItem('uiid');
        try {
            const { data: { data: resultData, statusCode } } = await getDropdownByTypeHTTP(payload);
            if (statusCode === 200 && resultData) {
                // setDropdownData({ property: pay['DropDownType'], value: resultData });
                return { property: pay['DropDownType'], value: resultData };
            }
        } catch (e) {
            toast.error('System error.');
        }
    }

    return [getDropdownByType];
}

export default useDropdownFilter;