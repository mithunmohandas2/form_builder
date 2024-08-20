import { useState } from "react";
import { controlsList } from "../../assets/controls";

function FormBuilder() {
    const [isControlList, setIsControlList] = useState<boolean>(true);
    const [controls, setControls] = useState<{ type: string; text: string }[]>([]);
    const [previewControls, setPreviewControls] = useState<(JSX.Element | null)[]>([]);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text'));
        setControls((prevControls) => {
            const updatedControls = [...prevControls, data];

            // Automatically update previewControls when controls are updated
            const preview = updatedControls.map((control, index) => {
                let newControl: JSX.Element | null = null;

                switch (control.type) {
                    case 'label':
                        newControl = <> <label key={index}>{control.text}:</label> <br /> </>;
                        break;
                    case 'radio':
                        newControl = <input key={index} type="radio" className="me-2 mb-6" />;
                        break;
                    case 'checkbox':
                        newControl = <input key={index} type="checkbox" className="me-2 mb-6" />;
                        break;
                    case 'textarea':
                        newControl = <textarea key={index} className="w-full border border-gray-300 rounded p-2 mb-6" />;
                        break;
                    case 'dropdown':
                        newControl = (
                            <div key={index}>
                                <select className="w-[40%] border border-gray-300 rounded p-2 mb-6 me-3">
                                    <option>Option 1</option>
                                </select>
                                <br />
                            </div>
                        );
                        break;
                    case 'input':
                        newControl = <input key={index} type="text" className="w-full border border-gray-300 rounded p-2 mb-6" />;
                        break;
                    case 'submit':
                        newControl =
                            <div key={index} className="flex space-x-3 mt-3 mb-6">
                                <button className="bg-[#F0F0F0] text-primary px-14 rounded py-1"> Clear </button>
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
                        <button className="px-6 py-1.5 rounded text-primary" onClick={() => { setPreviewControls([]); setControls([]) }}>Cancel</button>
                        <button className="px-6 py-1.5 rounded text-white bg-primary hover:bg-primaryHover" >Preview</button>
                    </div>

                </div>
            </section>


            <section className="flex flex-col md:flex-row justify-between min-h-[80vh]">

                <div className="w-full md:w-[49%] lg:w-[59%] xl:w-[69%]  2xl:w-[74%] bg-white border rounded p-10">

                    {previewControls?.length ?
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

                    <div>{previewControls}</div>

                    <div className="mt-14 w-full flex items-center justify-center h-28 text-dragBox rounded-lg border border-dashed border-dragBox"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}>
                        Drag controls here to add
                    </div>


                </div>


                {/* ========== Draggable Section Pane =========== */}
                <div className="w-full md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[25%] p-3 bg-white border rounded">

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
                                    e.dataTransfer.setData('text', JSON.stringify({ type: item.type, text: item.text }));
                                }}
                            >
                                <img src={`/icons/${item.icon}`} alt={item.text} className={`${item.icon.includes('submit') ? 'w-10' : 'w-5'} mb-2`} />
                                {item.text}
                            </div>
                        ))}
                    </div>}

                </div>

            </section>

        </div>
    )
}

export default FormBuilder