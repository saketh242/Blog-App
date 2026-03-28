package com.blog.blogapp;

import com.blog.blogapp.config.ElasticsearchInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@EnableKafka
@SpringBootApplication
public class BlogappApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(BlogappApplication.class);
		app.addInitializers(new ElasticsearchInitializer());
		app.run(args);
	}
 
}
