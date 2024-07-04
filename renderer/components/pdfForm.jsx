import { useState } from 'react';
import { Page, Text, View, Document, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

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



    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const hasMeaningfulData = (array, fields) => {
        return array?.some(item => fields.some(field => item[field] !== ''));
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


    Font.register({
        family: 'Open Sans',
        fonts: [
            { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
            { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 }
        ]
    });

    const styles = StyleSheet.create({
        container: {
            padding: 5,
            paddingBottom: 15,
            fontFamily: 'Open Sans',
            fontSize: 12,
            textAlign: 'left'
        },
        header: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            marginTop: 5,
            marginBottom: 5,
        },
        headerImage: {
            height: 80,
        },
        title: {
            flexDirection: 'column',
            fontSize: 12,
            textAlign: 'left'
        },
        h1: {
            fontSize: 18,
            color: '#000',
        },
        h2: {
            fontSize: 16,
            color: '#000',
        },
        h3: {
            fontSize: 12,
            color: '#000',
            fontWeight: 'bold',
        },
        section: {
            marginBottom: 20,
        },
        members: {
            display: 'flex',
            flexDirection: 'column',
        },
        member: {
            margin: '5px 0',
        },
        participants: {
            display: 'flex',
            flexDirection: 'column',
        },
        participant: {
            margin: '5px 0',
        },
        resolutions: {
            padding: 1.5,
            marginHorizontal: 20,
            textAlign: 'justify',
        },
        resolution: {
            padding: 1.5,
            marginHorizontal: 20,
            textAlign: 'justify',
        },
        footer: {
            fontSize: 12,
            textAlign: 'center',
            marginTop: 20,
            marginHorizontal: 20,
            textAlign: 'left'
        },
        footerPresident: {
            marginVertical: 10,
            fontWeight: 'bold',
        },
        footerMembers: {
            marginVertical: 10,
            fontWeight: 'bold',
        },
        firstPage: {
            display: 'block',
            marginHorizontal: 'auto',
            textAlign: 'center',
            marginHorizontal: 100,
        },
        table: {
            fontSize: 12,
            width: '100%',
            marginTop: 16,
            borderCollapse: 'collapse',
        },
        th: {
            borderTop: '1px solid #000',
            borderBottom: '1px solid #000',
            borderLeft: 'none',
            borderRight: 'none',
            padding: 6,
            textAlign: 'start',
        },
        td: {
            borderTop: '1px solid #000',
            borderBottom: '1px solid #000',
            borderLeft: 'none',
            borderRight: 'none',
            padding: 6,
            textAlign: 'start',
        },
        separator: {
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
            marginVertical: 7,
        },
        bulletPoint: {
            textAlign: 'left',
            marginVertical: 2,
        },
        coloredText: {
            color: '#00b0f0',
        },
        codeText: {
            color: '#00b0f0',
        },
        defaultText: {
            color: '#000000',
        },
        resolutionTitle: {
            fontWeight: 'bold',
            color: '#00b0f0',
            textAlign: 'justify',
            fontSize: 16,
            marginTop: 20,
        },
        highlight: {
            color: '#000',
            display: "flex",
            marginBottom: 25,
            fontWeight: 'bold',
            fontSize: 14,
        },
        content: {
            margin: 5,
        }
    });

    const MyDocument = ({ formData }) => (


        <Document onLoadSuccess={onDocumentLoadSuccess}>


            <Page size="A4" style={styles.container} pageNumber={pageNumber}>

                <view fixed>
                    <View style={styles.header}>
                        <Image style={styles.headerImage} src="/images/logo.png" />
                        <View style={{ borderLeft: '1px solid #eee', height: 60, margin: '0 20px' }} />
                        <View style={styles.title}>
                            <Text style={{ fontSize: 8, textAlign: 'right' }} render={({ pageNumber, totalPages }) => (
                                `${pageNumber} / ${totalPages}`
                            )} />
                            <Text style={styles.h3}>PROCES VERBAL DE DELIBERATION</Text>
                            <Text style={styles.h3}>COMITE DE DIRECTION</Text>
                            <Text style={styles.h3}>{formData.date}</Text>
                        </View>

                    </View>
                    <View style={{ borderBottom: '1px solid #eee', marginBottom: 15 }} />

                </view>

                <View style={styles.firstPage}>
                    <View style={styles.section}>
                        <View style={styles.separator} />
                        <Text >Date : {formData.date}</Text>
                        <View style={styles.separator} />
                        <Text >Ordre du Jour : {formData.ordreDuJour}</Text>
                    </View>
                    <View style={[styles.section, styles.members]}>

                        <Text style={styles.h3}>LES MEMBRES</Text>
                        <View style={styles.table}>

                            <Text style={styles.td}><Text style={styles.h3}>Président : </Text>{formData.president}</Text>
                            {formData.members?.map((member, index) => (
                                <View key={index} style={styles.tr}>
                                    <Text style={styles.td}><Text style={styles.h3}>Membre : </Text> {member.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.h3}>Le secrétariat :</Text>
                        <Text> {formData.secretariat}</Text>
                        <View style={styles.table}>

                            <Text style={[styles.td, { fontWeight: 'bold' }]}>Les participants :</Text>
                            {formData.participants?.map((participant, index) => (
                                <View key={index} style={styles.tr}>
                                    <Text style={styles.td}>{participant.name} : {participant.role}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text>{formData.presentateurs}</Text>
                    </View>
                    <View style={styles.section}>
                        {formData.demandes?.attributions && <Text style={styles.bulletPoint}>• {formData.demandes?.attributions} dossiers de demandes d’attributions directes  ;</Text>}
                        {formData.demandes?.pexploration && <Text style={styles.bulletPoint}>• {formData.demandes?.pexploration} dossier de demande de permis minier d'exploration  ;</Text>}
                        {formData.demandes?.substitutions && <Text style={styles.bulletPoint}>• {formData.demandes?.substitutions} dossiers de demandes de substitution  ;</Text>}
                        {formData.demandes?.exploitations && <Text style={styles.bulletPoint}>• {formData.demandes?.exploitations} dossier de demande de permis minier suite à une exploration ;</Text>}
                        {formData.demandes?.renouvellements && <Text style={styles.bulletPoint}>• {formData.demandes?.renouvellements} dossiers de demandes de renouvellement ;</Text>}
                        {formData.demandes?.transferts && <Text style={styles.bulletPoint}>• {formData.demandes?.transferts} dossiers de demandes de transfert / cession ;</Text>}
                        {formData.demandes?.extensionsPerimetre && <Text style={styles.bulletPoint}>• {formData.demandes?.extensionsPerimetre} dossiers de demande d’extension de périmètre ;</Text>}
                        {formData.demandes?.extensionsSubstance && <Text style={styles.bulletPoint}>• {formData.demandes?.extensionsSubstance} dossier de demandes d’extension de substance ;</Text>}
                        {formData.demandes?.modification && <Text style={styles.bulletPoint}>• {formData.demandes?.modification} dossier de demande de modification des coordonnées ;</Text>}
                        {formData.demandes?.extensionsDestination && <Text style={styles.bulletPoint}>• {formData.demandes?.extensionsDestination} dossier de demande d’extension de destination ;</Text>}
                        {formData.demandes?.fusion && <Text style={styles.bulletPoint}>• {formData.demandes?.fusion} dossier de demande de fusion des périmètres ;</Text>}
                        {formData.demandes?.correction && <Text style={styles.bulletPoint}>• {formData.demandes?.correction} dossier de demande de correction des coordonnées ;</Text>}
                        {formData.demandes?.diverses && <Text style={styles.bulletPoint}>• {formData.demandes?.diverses} dossiers avec des demandes diverses ;</Text>}
                        {formData.demandes?.arm && <Text style={styles.bulletPoint}>• {formData.demandes?.arm} dossiers de substitution et extension de permis d’exploitation minière artisanale de l’or ;</Text>}
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.section}>
                        <Text>Après examen et délibération, le comité de Direction de l'Agence Nationale des Activités Minières a adopté les résolutions suivantes :</Text>
                    </View>
                    {hasMeaningfulData(formData.explorations, []) && (
                        <View style={styles.section}>
                            <Text style={styles.h3}>Explorations</Text>
                            {formData.explorations.map((exploration, index) => (
                                <Text key={index}>{exploration}</Text>
                            ))}
                        </View>
                    )}
                    {hasMeaningfulData(formData.demandesAntenne, []) && (
                        <View style={[styles.section, styles.resolutions]}>
                            <Text style={styles.h3}>Demande aux Chefs des Antennes de</Text>
                            {formData.demandesAntenne.map((antenne, index) => (
                                <Text key={index}>• {antenne}</Text>
                            ))}
                        </View>
                    )}
                    {hasMeaningfulData(formData.ajourne, ['societe', 'code', 'resolution']) && (
                        <View style={[styles.section, styles.resolutions]}>
                            <Text style={styles.h3}>Ajourne le traitement des demandes suivantes</Text>
                            {formData.ajourne.map((item, index) => (
                                <Text key={index} style={styles.bulletPoint}>
                                    <Text style={styles.coloredText}>• </Text>
                                    <Text style={styles.defaultText}>{item.societe}</Text>
                                    <Text style={styles.codeText}> {item.code}</Text>
                                    <Text style={styles.defaultText}> : {item.resolution}</Text>
                                </Text>
                            ))}
                        </View>
                    )}
                    {hasMeaningfulData(formData.refuse, ['societe', 'code', 'resolution']) && (
                        <View style={[styles.section, styles.resolutions]}>
                            <Text style={styles.h3}>Donne un avis défavorable aux demandes suivantes</Text>
                            {formData.refuse.map((item, index) => (
                                <Text key={index} style={styles.bulletPoint}>
                                    <Text style={styles.coloredText}>• </Text>
                                    <Text style={styles.defaultText}>{item.societe}</Text>
                                    <Text style={styles.codeText}> {item.code}</Text>
                                    <Text style={styles.defaultText}> : {item.resolution}</Text>
                                </Text>
                            ))}
                        </View>
                    )}
                    {hasMeaningfulData(formData.approuve, ['societe', 'code', 'resolution']) && (
                        <View style={[styles.section, styles.resolutions]}>
                            <Text style={styles.h3}>Approuve les demandes suivantes</Text>
                            {formData.approuve.map((item, index) => (
                                <Text key={index} style={styles.bulletPoint}>
                                    <Text style={styles.coloredText}>• </Text>
                                    <Text style={styles.defaultText}>{item.societe}</Text>
                                    <Text style={styles.codeText}> {item.code}</Text>
                                    <Text style={styles.defaultText}> : {item.resolution}</Text>
                                </Text>
                            ))}
                        </View>
                    )}
                    {hasMeaningfulData(formData.rejette, ['societe', 'code', 'resolution']) && (
                        <View style={[styles.section, styles.resolutions]}>
                            <Text style={styles.resolution}>Rejette les demandes suivantes</Text>
                            {formData.rejette.map((item, index) => (
                                <Text key={index} style={styles.bulletPoint}>
                                    <Text style={styles.coloredText}>• </Text>
                                    <Text style={styles.defaultText}>{item.societe}</Text>
                                    <Text style={styles.codeText}> {item.code}</Text>
                                    <Text style={styles.defaultText}> : {item.resolution}</Text>
                                </Text>
                            ))}
                        </View>
                    )}
                    {hasMeaningfulData(formData.armCodes, ['societe', 'code', 'resolution']) && (
                        <View style={[styles.section, styles.resolutions]}>
                            <Text style={styles.resolutionTitle}>Résolution n°02</Text>
                            <Text>Le Comité de Direction après examen des dossiers relatifs aux exploitations artisanales minières de l’or décide de:</Text>
                            {formData.armCodes.map((item, index) => (
                                <Text key={index} style={styles.bulletPoint}>
                                    <Text style={styles.coloredText}>• </Text>
                                    <Text style={styles.defaultText}>{item.societe}</Text>
                                    <Text style={styles.codeText}> {item.code}</Text>
                                    <Text style={styles.defaultText}> : {item.resolution}</Text>
                                </Text>
                            ))}
                        </View>
                    )}
                </View>
                <View style={styles.footer}>
                    <Text>Tous les points inscrits à l’ordre du jour ayant été traités, le Président déclare la réunion terminée.</Text>
                    <Text>Le présent procès-verbal est édité en un exemplaire original unique classé au niveau du secrétariat du Comité de Direction de l’ANAM.</Text>
                    <View style={styles.footerPresident}>
                        <Text>Le Président</Text>
                        <Text style={styles.highlight}>{formData.president}</Text>
                    </View>
                    <View style={styles.footerMembers}>
                        <Text>Les membres</Text>
                        {formData.members?.map((member, index) => (
                            <Text key={index} style={styles.highlight}>{member.name}</Text>
                        ))}
                    </View>
                </View>

            </Page>
        </Document>

    );




    const generatePdf = async () => {
        const fileName = 'test.pdf';
        const blob = await pdf(<MyDocument formData={formData} />).toBlob();
        saveAs(blob, fileName);
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

                <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button" onClick={generatePdf}>Generate PDF</button>
            </form>
        </div>
    );
};

export default PdfForm;