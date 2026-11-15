package com.sysdesign.modules.curriculum.model;

import jakarta.persistence.*;

@Entity
@Table(name = "subtopics")
public class Subtopic {

    @Id
    @Column(length = 120)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder;

    public Subtopic() {}

    public Subtopic(String id, Topic topic, String title, Integer sequenceOrder) {
        this.id = id;
        this.topic = topic;
        this.title = title;
        this.sequenceOrder = sequenceOrder;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getSequenceOrder() {
        return sequenceOrder;
    }

    public void setSequenceOrder(Integer sequenceOrder) {
        this.sequenceOrder = sequenceOrder;
    }
}
