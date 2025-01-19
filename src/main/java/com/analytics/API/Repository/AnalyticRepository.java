package com.analytics.API.Repository;

import com.analytics.API.Models.Analytics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalyticRepository  extends MongoRepository<Analytics, String> {

}
