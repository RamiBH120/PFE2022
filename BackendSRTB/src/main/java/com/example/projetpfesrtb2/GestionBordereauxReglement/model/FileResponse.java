package com.example.projetpfesrtb2.GestionBordereauxReglement.model;
public class FileResponse {

    private Long id;

    private String type;

    private String name;

    public FileResponse(Long id, String type, String name) {
        super();
        this.id = id;
        this.type = type;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}