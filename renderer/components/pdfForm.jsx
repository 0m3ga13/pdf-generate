import { useState } from 'react';
import * as XLSX from 'xlsx';
import PdfGen from "./PdfGen"


const PdfForm = () => {
    const [formData, setFormData] = useState({
        date: '',
        ordreDuJour: '',
        president: '',
        members: [{ name: '' }],
        secretariat: '',
        participants: [{ name: '', role: '' }],
        presentateurs: '',
        demandes: {
            attributions: '',
            substitutions: '',
            exploitations: '',
            renouvellements: '',
            transferts: '',
            extensionsPerimetre: '',
            extensionsSubstance: '',
            extensionsDestination: '',
            diverses: '',
            pexploration: '',
            modification: '',
            fusion: '',
            correction: '',
            arm: ''
        },
        explorations: [''],
        demandesAntenne: [''],
        ajourne: [{ societe: '', code: '', resolution: '' }],
        refuse: [{ societe: '', code: '', resolution: '' }],
        approuve: [{ societe: '', code: '', resolution: '' }],
        rejette: [{ societe: '', code: '', resolution: '' }],
        armCodes: [{ societe: '', code: '', resolution: '' }]
    });

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            const newFormData = { approuve: [], rejette: [], ajourne: [], refuse: [], armCodes: [] };
            worksheet.slice(1).forEach(row => {
                const [status, societe, code, resolution] = row;
                if (status && societe && code && resolution) {
                    newFormData[status.toLowerCase()].push({ societe, code, resolution });
                }
            });

            // Merge the new data with the existing formData
            setFormData(prevFormData => ({
                ...prevFormData,
                ...newFormData,
            }));
        };

        reader.readAsArrayBuffer(file);
    };


    const FormSection = ({ categoryName, formData, handleArrayChange, handleDelete, addArrayItem }) => (
        <div className="form-group mb-4">
            <label className="block text-sm font-bold mb-2">{categoryName} Codes</label>
            {formData.map((item, index) => (
                <div className="flex flex-row mb-2 gap-1" key={index}>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="societe" value={item.societe} onChange={(e) => handleArrayChange(index, 'societe', e.target.value, categoryName)} placeholder={`Societe ${categoryName} ${index + 1}`} />
                    <input className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="code" value={item.code} onChange={(e) => handleArrayChange(index, 'code', e.target.value, categoryName)} placeholder={`Code ${categoryName} ${index + 1}`} />
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="resolution" value={item.resolution} onChange={(e) => handleArrayChange(index, 'resolution', e.target.value, categoryName)} placeholder={`Resolution ${categoryName} ${index + 1}`} />

                    {/* Additional Fields */}
                    <input className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="substance" value={item.substance} onChange={(e) => handleArrayChange(index, 'substance', e.target.value, categoryName)} placeholder={`Substance ${categoryName} ${index + 1}`} />
                    <input className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="lieu-dit" value={item['lieu-dit']} onChange={(e) => handleArrayChange(index, 'lieu-dit', e.target.value, categoryName)} placeholder={`Lieu-dit ${categoryName} ${index + 1}`} />
                    <input className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="commune" value={item.commune} onChange={(e) => handleArrayChange(index, 'commune', e.target.value, categoryName)} placeholder={`Commune ${categoryName} ${index + 1}`} />
                    <input className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="wilaya" value={item.wilaya} onChange={(e) => handleArrayChange(index, 'wilaya', e.target.value, categoryName)} placeholder={`Wilaya ${categoryName} ${index + 1}`} />
                    <input className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="superficie" value={item.superficie} onChange={(e) => handleArrayChange(index, 'superficie', e.target.value, categoryName)} placeholder={`Superficie ${categoryName} ${index + 1}`} />
                    <input className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="substance-sollicite" value={item['substance-sollicite']} onChange={(e) => handleArrayChange(index, 'substance-sollicite', e.target.value, categoryName)} placeholder={`Substance Sollicité ${categoryName} ${index + 1}`} />

                    <button className="border rounded-2xl text-white p-1 ml-1 bg-red-500 leading-tight focus:outline-none focus:shadow-outline" onClick={(event) => handleDelete(categoryName, index, event)}>X</button>
                </div>
            ))}
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button" onClick={() => addArrayItem(categoryName, { societe: '', code: '', resolution: '', substance: '', 'lieu-dit': '', commune: '', wilaya: '', superficie: '', 'substance-sollicite': '' })}>Add {categoryName} Code</button>
        </div>
    );




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDemandesChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            demandes: {
                ...prevState.demandes,
                [name]: value
            }
        }));
    };

    const handleArrayChange = (index, field, value, arrayName) => {
        const newArray = [...formData[arrayName]];
        newArray[index][field] = value;
        setFormData((prev) => ({ ...prev, [arrayName]: newArray }));
    };

    const handleSimpleArrayChange = (index, value, arrayName) => {
        const newArray = [...formData[arrayName]];
        newArray[index] = value;
        setFormData((prev) => ({ ...prev, [arrayName]: newArray }));
    };

    const removeArrayItem = (index, arrayName) => {
        const newArray = formData[arrayName].filter((_, i) => i !== index);
        setFormData((prevState) => ({
            ...prevState,
            [arrayName]: newArray
        }));
    };


    const addArrayItem = (arrayName, item) => {
        setFormData((prev) => ({
            ...prev,
            [arrayName]: [...prev[arrayName], item],
        }));
    };

    const handleDelete = (category, index, event) => {
        event.preventDefault();
        const updatedCategory = formData[category].filter((_, i) => i !== index);
        setFormData({ ...formData, [category]: updatedCategory });
    };




    return (
        <div className=" mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Generate PDF</h1>
            <form>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Date</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        placeholder="Date"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Ordre du Jour</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="ordreDuJour"
                        value={formData.ordreDuJour}
                        onChange={handleChange}
                        placeholder="Ordre du Jour"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Président</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="president"
                        value={formData.president}
                        onChange={handleChange}
                        placeholder="Président"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Members</label>
                    {formData.members?.map((member, index) => (
                        <div key={index} className="mb-2">
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                name="name"
                                value={member.name}
                                onChange={(e) => handleArrayChange(index, 'name', e.target.value, 'members')}
                                placeholder={`Membre ${index + 1}`}
                            />
                        </div>
                    ))}
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={() => addArrayItem('members', { name: '' })}
                    >
                        Add Member
                    </button>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Le Secretariat</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="secretariat"
                        value={formData.secretariat}
                        onChange={handleChange}
                        placeholder="Le Secretariat"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Participants</label>
                    {formData.participants?.map((participant, index) => (
                        <div key={index} className="mb-2">
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                name="name"
                                value={participant.name}
                                onChange={(e) => handleArrayChange(index, 'name', e.target.value, 'participants')}
                                placeholder={`Participant ${index + 1}`}
                            />
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                                name="role"
                                value={participant.role}
                                onChange={(e) => handleArrayChange(index, 'role', e.target.value, 'participants')}
                                placeholder={`Role Participant ${index + 1}`}
                            />
                        </div>
                    ))}
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={() => addArrayItem('participants', { name: '', role: '' })}
                    >
                        Add Participant
                    </button>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Presentateurs</label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="presentateurs"
                        value={formData.presentateurs}
                        onChange={handleChange}
                        placeholder="Presentateurs"
                    ></textarea>
                </div>
                {/* Demandes  */}
                <div className="form-group mb-4" >
                    <label className="block text-sm font-bold mb-2">Demandes</label>

                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="pexploration" value={formData.demandes?.pexploration} onChange={(e) => handleDemandesChange(e)} placeholder="Demande de permis minier d'exploration"></textarea>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

                        name="exploitations" value={formData.demandes?.exploitations} onChange={(e) => handleDemandesChange(e)} placeholder="Demande de permis minier suite à une exploration"></textarea>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

                        name="renouvellements" value={formData.demandes?.renouvellements} onChange={(e) => handleDemandesChange(e)} placeholder="Demandes de renouvellement"></textarea>

                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="transferts" value={formData.demandes?.transferts} onChange={(e) => handleDemandesChange(e)} placeholder="Demandes de transfert /cession"></textarea>

                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="extensionsPerimetre" value={formData.demandes?.extensionsPerimetre} onChange={(e) => handleDemandesChange(e)} placeholder="Demande d’extension de périmètre"></textarea>

                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="correction" value={formData.demandes?.correction} onChange={(e) => handleDemandesChange(e)} placeholder="Demandes de correction des coordonnées"></textarea>

                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="modification" value={formData.demandes?.modification} onChange={(e) => handleDemandesChange(e)} placeholder="Demande de modification des coordonnées"></textarea>

                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="fusion" value={formData.demandes?.fusion} onChange={(e) => handleDemandesChange(e)} placeholder="Demande de fusion des périmètres"></textarea>

                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="extensionsSubstance" value={formData.demandes?.extensionsSubstance} onChange={(e) => handleDemandesChange(e)} placeholder="Demande d’extension de substance"></textarea>

                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="extensionsDestination" value={formData.demandes?.extensionsDestination} onChange={(e) => handleDemandesChange(e)} placeholder="Demande d’extension de destination"></textarea>

                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="diverses" value={formData.demandes?.diverses} onChange={(e) => handleDemandesChange(e)} placeholder="Demandes diverses"></textarea>

                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="arm" value={formData.demandes?.arm} onChange={(e) => handleDemandesChange(e)} placeholder="Demandes de permis d’exploitation minière artisanale de l’or"></textarea>
                </div>
                {/* Explorations  */}
                <div className="form-group mb-4" >
                    <label className="block text-sm font-bold mb-2">Explorations</label>
                    {formData.explorations?.map((exploration, index) => (
                        <div key={index} className="mb-2">
                            <input name="exploration" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={exploration} onChange={(e) => handleSimpleArrayChange(index, e.target.value, 'explorations')} placeholder={`Exploration ${index + 1}`} />
                        </div>
                    ))}
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button" onClick={() => addArrayItem('explorations', '')}>Add Exploration</button>
                </div>
                {/* Demandes Antennes  */}
                <div className="mb-4 form-group" >
                    <label className="block text-sm font-bold mb-2">Demande Antenne</label>
                    {formData.demandesAntenne?.map((antenne, index) => (
                        <div className="flex flex-row mb-2 gap-1">
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                name="demandeAntenne" value={antenne} onChange={(e) => handleSimpleArrayChange(index, e.target.value, 'demandesAntenne')} placeholder={`Demande Antenne ${index + 1}`} />
                        </div>
                    ))}
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button" onClick={() => addArrayItem('demandesAntenne', '')}>Add Demande Antenne</button>
                </div>
                <div>
                    <label className="block text-sm font-bold mt-2">Upload Your File</label>

                    <div>
                        <input type="file" onChange={handleFileUpload} />

                        <FormSection
                            categoryName="Ajourné"
                            formData={formData.ajourne}
                            handleArrayChange={handleArrayChange}
                            handleDelete={handleDelete}
                            addArrayItem={addArrayItem}
                        />

                        <FormSection
                            categoryName="Refuse"
                            formData={formData.refuse}
                            handleArrayChange={handleArrayChange}
                            handleDelete={handleDelete}
                            addArrayItem={addArrayItem}
                        />

                        <FormSection
                            categoryName="Approuve"
                            formData={formData.approuve}
                            handleArrayChange={handleArrayChange}
                            handleDelete={handleDelete}
                            addArrayItem={addArrayItem}
                        />

                        <FormSection
                            categoryName="Rejette"
                            formData={formData.rejette}
                            handleArrayChange={handleArrayChange}
                            handleDelete={handleDelete}
                            addArrayItem={addArrayItem}
                        />

                        <FormSection
                            categoryName="ARM"
                            formData={formData.armCodes}
                            handleArrayChange={handleArrayChange}
                            handleDelete={handleDelete}
                            addArrayItem={addArrayItem}
                        />
                    </div>
                </div>
                <PdfGen formData={formData} />

            </form>
        </div>
    );
};

export default PdfForm;