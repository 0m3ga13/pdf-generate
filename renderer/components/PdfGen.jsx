"use client"
import { useState } from 'react';
import { Page, Text, View, Document, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';






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



const PdfGen = ({ formData }) => {

    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const hasMeaningfulData = (array, fields) => {
        return array?.some(item => fields.some(field => item[field] !== ''));
    };

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
        <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button" onClick={generatePdf}>Generate PDF</button>
    )
}

export default PdfGen;