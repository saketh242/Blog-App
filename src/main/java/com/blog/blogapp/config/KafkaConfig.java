package com.blog.blogapp.config;

import com.blog.blogapp.event.BlogEvent;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id}")
    private String groupId;

    // =========================
    // ✅ PRODUCER
    // =========================
    @Bean
    public ProducerFactory<String, BlogEvent> producerFactory() {
        Map<String, Object> config = new HashMap<>();

        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.springframework.kafka.support.serializer.JsonSerializer");

        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, BlogEvent> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    // =========================
    // ✅ CONSUMER (Spring Kafka 4.0+ Way)
    // =========================
    @Bean
    public ConsumerFactory<String, BlogEvent> consumerFactory() {

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.springframework.kafka.support.serializer.JsonDeserializer");
        props.put("spring.json.type.mapping", "BlogEvent:com.blog.blogapp.event.BlogEvent");
        props.put("spring.json.trusted.packages", "*");

        return new DefaultKafkaConsumerFactory<>(props);
    }

    // =========================
    // ✅ LISTENER FACTORY
    // =========================
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, BlogEvent> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, BlogEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(consumerFactory());
        factory.setConcurrency(3);

        return factory;
    }

    // =========================
    // ✅ OPTIONAL (AUTO CREATE TOPIC)
    // =========================
    @Bean
    public NewTopic blogTopic() {
        return new NewTopic("blog-topic", 1, (short) 1);
    }
}