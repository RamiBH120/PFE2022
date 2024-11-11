package com.example.projetpfesrtb2.GestionMedecin.Service;


import com.example.projetpfesrtb2.GestionBordereauxEnvoi.repo.ActeBSRepo;
import com.example.projetpfesrtb2.GestionMedecin.model.Medecin;
import com.example.projetpfesrtb2.GestionMedecin.repo.MedecinRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class MedecinService {

    @Autowired
    private MedecinRepo medecinRepo;

    @Autowired
    private ActeBSRepo acteBSRepo ;

    public Medecin addMedecin(Medecin medecin) {
        return medecinRepo.save(medecin);
    }

    public List<Medecin> findAllMedecins() {
        return medecinRepo.findAll();
    }

    public Medecin fetchMedecinByMatriculeFiscale(String matriculeFiscale) {
        return medecinRepo.findMedecinByMatriculeFiscale(matriculeFiscale);
    }

    public Medecin findMedecinById(Long id) {
        return medecinRepo.findMedecinById(id);
    }

    public Medecin updateMedecin(Medecin medecin) {
        return medecinRepo.save(medecin);
    }

    public void deleteMedecin(Long id) {
        medecinRepo.deleteMedecinById(id);
    }

    public Boolean existsMatriMed(String mat) { return medecinRepo.existsByMatriculeMedecin(mat); }

    public Boolean existsMatFisMed(String matFis) { return medecinRepo.existsMedecinByMatriculeFiscale(matFis); }

    public Boolean existMedByMatr(String matricule) { return acteBSRepo.existsActeBSByMedecin_MatriculeMedecin(matricule); }
    public Boolean existPraByMatr(String matricule) { return acteBSRepo.existsActeBSByMatPraticienActeBS(matricule); }

/*
    public static ByteArrayInputStream productsPdfReport(List<Medecin> medecins) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            PdfWriter.getInstance(document, out);
            document.open();
            //add text to pdf file
            com.itextpdf.text.Font font = FontFactory.getFont(FontFactory.COURIER, 14, BaseColor.BLACK);
            Paragraph para = new Paragraph("Listes des Medecins", font);
            para.setAlignment(Element.ALIGN_CENTER);
            document.add(para);
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(7);

            //make Columns

            Stream.of("nom", "prenom", "matricule Fiscale", "type", "adresse", "N° de téléphone", "ville").forEach(headerTitle -> {
                PdfPCell header = new PdfPCell();
                com.itextpdf.text.Font headfont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
                header.setBackgroundColor(BaseColor.LIGHT_GRAY);
                header.setHorizontalAlignment(Element.ALIGN_CENTER);
                header.setBorderWidth(1);
                header.setPhrase(new Phrase(headerTitle, headfont));
                table.addCell(header);
            });

            for (Medecin med : medecins) {


                PdfPCell titleCell1 = new PdfPCell(new Phrase(med.getNom()));
                titleCell1.setPaddingLeft(1);
                titleCell1.setVerticalAlignment(Element.ALIGN_MIDDLE);
                titleCell1.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(titleCell1);


                PdfPCell titleCell2 = new PdfPCell(new Phrase(med.getPrenom()));
                titleCell2.setPaddingLeft(1);
                titleCell2.setVerticalAlignment(Element.ALIGN_MIDDLE);
                titleCell2.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(titleCell2);

                PdfPCell titleCell3 = new PdfPCell(new Phrase(med.getMatriculeFiscale()));
                titleCell3.setPaddingLeft(1);
                titleCell3.setVerticalAlignment(Element.ALIGN_MIDDLE);
                titleCell3.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(titleCell3);


                PdfPCell titleCell4 = new PdfPCell(new Phrase(med.getType()));
                titleCell4.setPaddingLeft(1);
                titleCell4.setVerticalAlignment(Element.ALIGN_MIDDLE);
                titleCell4.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(titleCell4);


                PdfPCell titleCell5 = new PdfPCell(new Phrase(med.getAdresse()));
                titleCell5.setPaddingLeft(1);
                titleCell5.setVerticalAlignment(Element.ALIGN_MIDDLE);
                titleCell5.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(titleCell5);


                PdfPCell titleCell6 = new PdfPCell(new Phrase(med.getPhoneNumber()));
                titleCell6.setPaddingLeft(1);
                titleCell6.setVerticalAlignment(Element.ALIGN_MIDDLE);
                titleCell6.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(titleCell6);


                PdfPCell titleCell7 = new PdfPCell(new Phrase(med.getVille()));
                titleCell7.setPaddingLeft(1);
                titleCell7.setVerticalAlignment(Element.ALIGN_MIDDLE);
                titleCell7.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(titleCell7);

            }
            // Defiles the relative width of the columns
            table.setWidthPercentage(110);

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

 */
}
