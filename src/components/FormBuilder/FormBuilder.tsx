import { Key, useState } from "react";
import { controlsList } from "../../assets/controls";
import Swal from 'sweetalert2';

function FormBuilder() {
    const [isControlList, setIsControlList] = useState<boolean>(true);
    const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
    const [controls, setControls] = useState<{ type: string; text: string }[]>([]);
    const [previewControls, setPreviewControls] = useState<(JSX.Element | null)[]>([]);
    const [formData, setFormData] = useState<null | {}>(null);

    async function getCustomText(type: string): Promise<string | null> {
        return Swal.fire({
            title: `Enter ${type === 'label' ? 'Label Text' : type === 'headings' ? 'Heading Text' : 'Dropdown Options'}`,
            input: 'text',
            inputPlaceholder: `Enter ${type === 'dropdown' ? 'Options seperated with ";" ' : 'your text here'}`,
            showCancelButton: true,
            confirmButtonText: 'Proceed',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#1C1CB5',
            inputValidator: (value) => {
                if (!value) {
                    return 'Enter text to proceed';
                }
                return null;
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                return result.value;
            }
            return null; // In case of cancellation or no input
        });
    }

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text'));

        // Handle custom labels
        if (((data.type === 'radio' || data.type === 'checkbox') || (data.type === 'textarea' || data.type === 'input')) || data.type === 'dropdown') {
            const controlText = await getCustomText('label');
            if (!controlText) return;
            data.label = controlText;
        }

        // Handle custom text for Label, Heading and Dropdown
        if ((data.type === 'label' || data.type === 'headings') || data.type === 'dropdown') {
            const controlText = await getCustomText(data.type);
            if (!controlText) return; // If user canceled, return
            data.text = controlText; // Assign custom text to the control
        }

        data.id = `${data.type + data.text}_${Math.random().toString(36).slice(2, 9)}`;  //generate unique ID

        setControls((prevControls) => {
            const updatedControls = [...prevControls, data];

            const preview = updatedControls.map((control: { text: string; type: string; id: string; label: string }, index: Key) => {
                let newControl: JSX.Element | null = null;

                switch (control.type) {
                    case 'label':
                        newControl = (
                            <>
                                <label key={index} htmlFor={control.id}>{control.text}</label>
                                <br />
                            </>
                        );
                        break;
                    case 'radio':
                        newControl = (
                            <div key={index}>
                                <input id={control.id} name={control.label} type="radio" className="me-2 mb-6" />
                                <label htmlFor={control.id}>{control.label}</label>
                            </div>
                        );
                        break;
                    case 'checkbox':
                        newControl = (
                            <div key={index}>
                                <input id={control.id} name={control.label} type="checkbox" className="me-2 mb-6" />
                                <label htmlFor={control.id}>{control.label}</label>
                            </div>
                        );
                        break;
                    case 'textarea':
                        newControl =
                            <div key={index}>
                                <label htmlFor={control.id}>{control.label}</label> <br />
                                <textarea id={control.id} name={control.text} className="w-full border border-gray-300 rounded p-2 mb-6" />
                            </div>
                        break;
                    case 'dropdown':
                        const optionList = control.text.split(";");
                        newControl = (
                            <div key={index}>
                                <label htmlFor={control.id}>{control.label}</label> <br />
                                <select id={control.id} name={control.text} className="w-[40%] border border-gray-300 rounded p-2 mb-6 me-3">
                                    {optionList.map((option: string, index: Key) => (
                                        <option key={index}>{option}</option>
                                    ))}
                                </select>
                                <br />
                            </div>
                        );
                        break;
                    case 'headings':
                        newControl = (
                            <div key={index} className="w-full text-center my-3">
                                <h1 className="text-2xl font-bold">{control.text}</h1>
                                <label htmlFor="Heading" className="hidden"></label> <br />
                                <input id="Heading" name="Heading" value={control.text} type="text" className="w-full border border-gray-300 rounded p-2 mb-6 hidden" />
                                <br />
                            </div>
                        );
                        break;
                    case 'input':
                        newControl =
                            <div key={index}>
                                <label htmlFor={control.id}>{control.label}</label> <br />
                                <input id={control.id} name={control.text} type="text" className="w-full border border-gray-300 rounded p-2 mb-6" />
                            </div>
                        break;
                    case 'submit':
                        newControl =
                            <div key={index} className="flex space-x-3 mt-3 mb-6">
                                <button className="bg-[#F0F0F0] text-primary px-14 rounded py-1" type="reset"> Clear </button>
                                <button type="submit" className="bg-primary text-white px-14 rounded py-1"> Submit </button>
                                <br />
                            </div>;
                        break;
                    default:
                        break;
                }

                return newControl;
            });

            setPreviewControls(preview);
            return updatedControls;
        });
    };

    function handleSubmitForm(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        if (!(e.currentTarget instanceof HTMLFormElement)) {
            console.error("handleSubmitForm was not triggered by an HTMLFormElement");
            return;
        }

        const formData = new FormData(e.currentTarget);

        // Convert formData to an object with label text as keys
        const formObject: { [key: string]: FormDataEntryValue | FormDataEntryValue[] } = {};
        formData.forEach((value, key) => {
            const inputElement = e.currentTarget.querySelector(`[name="${key}"]`) as HTMLInputElement;
            if (inputElement) {
                const labelText = inputElement.closest('div')?.querySelector('label')?.textContent || key;
                if (formObject[labelText]) {
                    // If the label text already exists, convert to array
                    if (Array.isArray(formObject[labelText])) {
                        (formObject[labelText] as FormDataEntryValue[]).push(value);
                    } else {
                        formObject[labelText] = [formObject[labelText] as FormDataEntryValue, value];
                    }
                } else {
                    formObject[labelText] = value;
                }
            }
        });

        // Handle the form data
        // console.log(formObject); //test
        setFormData(formObject);
        Swal.fire({
            text: "Form submitted successfully",
            icon: "success",
            showConfirmButton: false,
        });
    }

    function handleSubmittedFormView(): void {
        if (!formData) {
            Swal.fire({
                text: "Please submit the form first",
                icon: "warning",
                confirmButtonColor: '#1C1CB5',
            });
        } else {
            // Convert formData object to an HTML string
            const formDataHtml = Object.entries(formData).map(([key, value]) => {
                if (key === 'heading') {
                    return `<p><strong>${key} :</strong> ${value}</p>`;
                } else if (value === 'on') {
                    return `<p><strong>${key} :</strong> Yes </p>`;
                } else {
                    return `<p><strong>${key} :</strong> ${value}</p>`;
                }
            }).join('');

            // Display the HTML string in popup
            Swal.fire({
                title: "Form Data",
                html: `
                    <div class="custom-popup">
                        ${formDataHtml}
                    </div>
                `,
                showCloseButton: true,
                showConfirmButton: false,
            });
        }
    }

    return (
        <div className="px-[16px] md:px-8 2xl:px-10 ">

            <section>
                <div className="flex justify-between items-center my-5">
                    <h2 className="text-2xl">Forms</h2>

                    <div className="flex items-center w-[25%]">
                        <input type="text" placeholder="Untitled form" className="w-full px-2 py-1 border-b bg-transparent placeholder:text-gray-600 focus:outline-none" />
                        <div className="border-b py-1">
                            <span className="text-sm text-gray-400">Saving...</span>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button className="px-6 py-1.5 rounded text-primary" onClick={() => {
                            if (isPreviewMode) setIsPreviewMode(false)          //Exit Preview Mode
                            else { setPreviewControls([]); setControls([]) }    // Clear the form
                        }}>{isPreviewMode ? 'Cancel' : 'Clear'}</button>

                        {isPreviewMode ?
                            <button className="px-6 py-1.5 rounded text-white bg-primary hover:bg-primaryHover" onClick={handleSubmittedFormView}>View</button>
                            :
                            <button className="px-6 py-1.5 rounded text-white bg-primary hover:bg-primaryHover" onClick={() => setIsPreviewMode(true)}>Preview</button>
                        }
                    </div>

                </div>
            </section>


            <section className={`flex flex-col md:flex-row ${isPreviewMode ? 'justify-center min-h-[80vh] pb-20' : 'justify-between h-[80vh]'}`}>

                <div className={`w-full md:w-[49%] lg:w-[59%] xl:w-[69%]  2xl:w-[74%] bg-white border rounded p-10 ${!isPreviewMode && 'overflow-y-auto'}`}>

                    {(previewControls?.length && !isPreviewMode) ?
                        <div className="w-full text-end cursor-pointer text-gray-400 material-symbols-outlined"
                            onClick={() => {
                                // Create new arrays excluding the last element
                                const updatedPreviewControls = previewControls.slice(0, -1);
                                const updatedControls = controls.slice(0, -1);

                                // Update state with new arrays
                                setPreviewControls(updatedPreviewControls);
                                setControls(updatedControls);
                            }}>
                            undo
                        </div>
                        : null
                    }

                    <form onSubmit={handleSubmitForm}>
                        <div>{previewControls}</div>
                    </form>

                    {!isPreviewMode && <div className="mt-14 w-full flex items-center justify-center h-28 text-dragBox rounded-lg border border-dashed border-dragBox"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}>
                        Drag controls here to add
                    </div>}

                </div>


                {/* ========== Draggable Section Pane =========== */}
                {!isPreviewMode && <div className="w-full md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[25%] p-3 bg-white border rounded">

                    {/* Selection Tabs */}
                    <div className="my-4 flex justify-evenly">
                        <button className={`py-1.5 w-1/2 mx-1 ${isControlList ? "border-b border-primary" :
                            "cursor-pointer"}`} onClick={() => setIsControlList(true)}>
                            <h5 className={`${isControlList ? 'text-primary' : 'text-[#808080]'}`}>Controls</h5>
                        </button>

                        <button className={`py-1.5 w-1/2 mx-1 ${!isControlList ? "border-b border-primary" :
                            "cursor-pointer"}`} onClick={() => setIsControlList(false)}>
                            <h5 className={`${!isControlList ? 'text-primary' : 'text-[#808080]'}`}>Properties</h5>
                        </button>
                    </div>

                    {isControlList && <div className="mt-4 grid grid-cols-3 p-8 gap-3">
                        {controlsList.map((item, index) => (
                            <div key={index} className="py-3 border rounded flex flex-col justify-center items-center hover:border-primary 
                            cursor-pointer text-sm hover:text-primary text-gray-500 hover:shadow-sm"
                                draggable onDragStart={(e) => {
                                    e.dataTransfer.setData('text', JSON.stringify({ type: item.type, text: item.text, id: item.text }));
                                }}
                            >
                                <img src={`/icons/${item.icon}`} alt={item.text} className={`${item.icon.includes('submit') ? 'w-10' : 'w-5'} mb-2`} />
                                {item.text}
                            </div>
                        ))}
                    </div>}

                </div>}

            </section>

        </div>
    )
}

export default FormBuilder



