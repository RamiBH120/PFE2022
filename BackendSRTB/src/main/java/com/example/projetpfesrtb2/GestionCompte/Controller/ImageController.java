package com.example.projetpfesrtb2.GestionCompte.Controller;

import com.example.projetpfesrtb2.GestionCompte.Service.ImageService;
import com.example.projetpfesrtb2.GestionCompte.model.Image;
import com.example.projetpfesrtb2.GestionCompte.Repository.ImageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity.BodyBuilder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

@RestController
@RequestMapping(path = "image")
public class ImageController {

    @Autowired
    ImageService imageService ;

    @GetMapping("/getImageAll")
    public ResponseEntity<List<Image>> getImageAll() {
        List<Image> images =  imageService.findAll();
        return new ResponseEntity<>(images, HttpStatus.OK);
    }

    @PostMapping("/upload")
    public ResponseEntity<Image> uploadImage(@RequestParam("imageFile") MultipartFile file) throws IOException {

        System.out.println("Original Image Byte Size - " + file.getBytes().length);
        Image img = new Image(file.getOriginalFilename(), file.getContentType(),
                compressBytes(file.getBytes()));
        Image im = imageService.addIma(img);
        return new ResponseEntity<>(im,HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable(name = "id") Long id){
        imageService.deleteImageById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = { "/get/{id}" })
    public Image getImage(@PathVariable("id") Long id) throws IOException {

        final Optional<Image> retrievedImage = imageService.getById(id);
        Image img = new Image() ;
        if (retrievedImage.isPresent()) {
            img = new Image(retrievedImage.get().getName(), retrievedImage.get().getType(),
                    decompressBytes(retrievedImage.get().getPicByte()));
        }
        return img;
    }

    // compress the image bytes before storing it in the database
    public static byte[] compressBytes(byte[] data) {
        Deflater deflater = new Deflater();
        deflater.setInput(data);
        deflater.finish();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        while (!deflater.finished()) {
            int count = deflater.deflate(buffer);
            outputStream.write(buffer, 0, count);
        }
        try {
            outputStream.close();
        } catch (IOException e) {
        }
        System.out.println("Compressed Image Byte Size - " + outputStream.toByteArray().length);

        return outputStream.toByteArray();
    }

    // uncompress the image bytes before returning it to the angular application
    public static byte[] decompressBytes(byte[] data) {
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        try {
            while (!inflater.finished()) {
                int count = inflater.inflate(buffer);
                outputStream.write(buffer, 0, count);
            }
            outputStream.close();
        } catch (IOException ioe) {
        } catch (DataFormatException e) {
        }
        return outputStream.toByteArray();
    }
}
