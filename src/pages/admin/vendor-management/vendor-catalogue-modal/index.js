import {
  Button,
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { useForm } from "react-hook-form";
import {
  createVendor,
  updateVendor,
} from "../../../../services/vendor-management-service";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import FormInput from "../../../../components/form-input";

const VendorCatalogueModal = ({
  isOpen,
  selectedCatalogue,
  handleCatalogueModal,
  getAllCatalogues,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vendorName: selectedCatalogue?.vendorName || "",
      vendorCode: selectedCatalogue?.vendorCode || "",
    },
  });

  const onSubmit = async (state) => {
    let payload = { ...state };
    payload["loginUIID"] = sessionStorage.getItem("uiid");
    if (selectedCatalogue) {
      payload["vendorId"] = selectedCatalogue?.vendorId;
    }
    console.log("selectedCatalogue", selectedCatalogue);
    try {
      const {
        data: { statusCode, statusMessage },
      } = !selectedCatalogue
        ? await createVendor(payload)
        : await updateVendor(payload);
      if (statusCode === 200) {
        toast.success(statusMessage);
        handleCatalogueModal(false);
        getAllCatalogues(true);
      } else {
        toast.error(statusMessage);
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const handleCustomSubmit = () => {
    handleSubmit((data) => {
      Swal.fire({
        title: `Are you sure to ${selectedCatalogue ? "Update" : "Submit"}?`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        denyButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          onSubmit(data);
        }
      });
    })();
  };

  return (
    <>
      <Modal size="xl" isOpen={isOpen} backdrop={true}>
        <ModalHeader>
          {`${selectedCatalogue ? "Update" : "Add"} Vendor Catalogue`}
        </ModalHeader>
        <ModalBody>
          <Card className="card_outer_padding">
            <CardBody>
              <div className="app-inner-layout__wrapper">
                <fieldset>
                  <form>
                    <Row>
                      <Col md={6}>
                        <FormInput
                          label="Vendor Code"
                          name="vendorCode"
                          control={control}
                          errors={errors}
                          rules={{ required: "Vendor Code is required" }}
                        />
                      </Col>
                      <Col md={6}>
                        <FormInput
                          label="Vendor Name"
                          name="vendorName"
                          control={control}
                          errors={errors}
                          rules={{ required: "Vendor Name is required" }}
                        />
                      </Col>
                    </Row>
                    <hr />
                    <div className="pull-right">
                      {selectedCatalogue?.CatalogueStatus !== "Inactive" ? (
                        <Button color="primary" onClick={handleCustomSubmit}>
                          {selectedCatalogue ? "Update" : "Submit"}
                        </Button>
                      ) : null}
                      &nbsp;
                      <Button
                        color="primary"
                        outline
                        onClick={() => handleCatalogueModal(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </form>
                </fieldset>
              </div>
            </CardBody>
          </Card>
        </ModalBody>
      </Modal>
    </>
  );
};

export default VendorCatalogueModal;
