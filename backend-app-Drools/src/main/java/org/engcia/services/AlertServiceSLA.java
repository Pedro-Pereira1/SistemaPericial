package org.engcia.services;

import org.engcia.Listener.CustomAgendaEventListener;
import org.engcia.model.AlertResponse;
import org.engcia.model.EvidencesSLA;
import org.kie.api.KieServices;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.LiveQuery;
import org.kie.api.runtime.rule.Row;
import org.kie.api.runtime.rule.ViewChangedEventListener;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AlertServiceSLA {
    static final Logger LOG = LoggerFactory.getLogger(AlertServiceSLA.class);
    private final CustomAgendaEventListener agendaEventListener = new CustomAgendaEventListener();

    public AlertResponse runEngine(EvidencesSLA input) {
        //System.out.println("Inside SLA");
        System.out.println(input.toString());


        final AlertResponse[] output = {null};
        try {
            // load up the knowledge base
            KieServices ks = KieServices.Factory.get();
            KieContainer kContainer = ks.getKieClasspathContainer();
            final KieSession kSession = kContainer.newKieSession("ksession-rules");
            kSession.addEventListener(agendaEventListener);

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
        //System.out.println("Output: " + output[0].toString());
        return output[0];
    }

    public String why() {
        List<String> firedRules = agendaEventListener.getFiredRules();
        if (firedRules.isEmpty()) {
            return "No rules were fired for the provided AlertResponse.";
        }

        StringBuilder explanation = new StringBuilder();
        explanation.append("The following rules were triggered during the decision process:\n");
        for (String rule : firedRules) {
            explanation.append("- ").append(rule).append("\n");
        }

        explanation.append("\nThe decision was made based on these rules and the provided input.");
        firedRules.clear();
        return explanation.toString();
    }

}
