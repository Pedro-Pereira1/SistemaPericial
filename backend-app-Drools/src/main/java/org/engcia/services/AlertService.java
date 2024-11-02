package org.engcia.services;

import org.drools.core.ClassObjectFilter;
import org.engcia.Listener.CustomAgendaEventListener;
import org.engcia.model.AlertResponse;
import org.engcia.model.Evidences;
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

import java.util.*;

@Service
public class AlertService {
    static final Logger LOG = LoggerFactory.getLogger(AlertService.class);
    private final CustomAgendaEventListener agendaEventListener = new CustomAgendaEventListener();

    public AlertResponse runEngine(Evidences input) {
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
        return output[0];
    }

    public List<String> how() {
        List<String> firedRules = agendaEventListener.getFiredRules();
        if (firedRules.isEmpty()) {
            firedRules.add("No rules were fired for the provided AlertResponse.");
            return firedRules;
        }
        List<String> sessionRules = new ArrayList<>(firedRules);
        sessionRules.add("\n\nThe decision was made based on these rules and the provided input.");
        sessionRules.add(0, "The following rules were triggered during the decision process:");

        return firedRules;
    }

    public void clear() {
        agendaEventListener.getFiredRules().clear();
    }

    public List<String> why(List<String> possibleAnswers) {
        List<String> firedRules = agendaEventListener.getFiredRules();
        if (firedRules.isEmpty()) {
            firedRules.add("No rules were fired for the provided AlertResponse.");
            return firedRules;
        }
        List<String> sessionRules = new ArrayList<>(firedRules);
        int pssblAnswrsSize = possibleAnswers.size(); //2
        int firedRulesSize = firedRules.size(); //3
        int j = 1;
        for (int i = pssblAnswrsSize; i != 0; i--) {
            sessionRules.add(firedRulesSize-j, "If your answer was: " + possibleAnswers.get(i - 1) + ", then the following rules were triggered:");
            j++;
        }

        for (int i = 0; i < pssblAnswrsSize; i++) {
            firedRules.remove(firedRules.size() - 1);
        }
        return sessionRules;
    }









}
