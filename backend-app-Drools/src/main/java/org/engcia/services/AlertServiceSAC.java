package org.engcia.services;

import org.engcia.model.AlertQuestion;
import org.engcia.model.AlertResponse;
import org.kie.api.KieServices;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.LiveQuery;
import org.kie.api.runtime.rule.Row;
import org.kie.api.runtime.rule.ViewChangedEventListener;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AlertServiceSAC {
    static final Logger LOG = LoggerFactory.getLogger(AlertServiceSLA.class);

    public AlertResponse runEngine(AlertQuestion input) {
        System.out.println("Inside SAC");
        System.out.println(input.toString());
        final AlertResponse[] output = {null};
        try {
            // load up the knowledge base
            KieServices ks = KieServices.Factory.get();
            KieContainer kContainer = ks.getKieClasspathContainer();
            final KieSession kSession = kContainer.newKieSession("ksession-rules");

            // Query listener
            ViewChangedEventListener listener = new ViewChangedEventListener() {
                @Override
                public void rowDeleted(Row row) {}

                @Override
                public void rowInserted(Row row) {
                    AlertResponse responseOutput = (AlertResponse) row.get("$response");
                    LOG.info("Output: " + responseOutput.toString());
                    output[0] = responseOutput;
                    kSession.halt();
                }

                @Override
                public void rowUpdated(Row row) {}

            };
            LiveQuery query = kSession.openLiveQuery("AlertResponse", null, listener);

            kSession.insert(input);
            kSession.fireAllRules();
            query.close();
        } catch (Throwable t) {
            t.printStackTrace();
        }
        System.out.println("Output: " + output[0].toString());
        return output[0];
    }
}
