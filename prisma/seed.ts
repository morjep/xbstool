import { getAllProjects, createNewProject } from "~/models/project.server";
import {
  getAllBreakdowns,
  createNewBreakdown,
  addDataToBreakdown,
} from "~/models/breakdown.server";
import { getAllElements, createTopElement, createElement } from "~/models/element.server";

function log() {
  getAllProjects().then((projects) => {
    console.log(projects);
  });
  getAllBreakdowns().then((breakdown) => {
    console.log(breakdown);
  });
  getAllElements().then((elements) => {
    console.log(elements);
  });
}

/**
 * It creates a project, a breakdown, a task, two sub tasks, and a sub sub task
 */
async function seed() {
  console.log("Seeding begun!");

  let project = await createNewProject("Sparxpres");
  let breakdown = await createNewBreakdown("Card features", project.id);
  await addDataToBreakdown(
    breakdown.id,
    `
  # Cards
  ## Onboarding af kæde
  ### Oprette kæde
  ### Opsætning kæde
  ### Oprette salgsted(-er)
  ### Oprette indløsningssted(-er)
  ### Opsætning af webshop
  ## Bestilling af gavekort (til kæde)
  ### Tilknytte nummerserie til kæde
  ## Køb af gavekort
  ### Køb af fysisk gavekort (hos salgssted)
  ### Køb af voucher til gavekort (via webshop)
  ## Brug af gavekort
  ### Ombytte voucher til fysisk kort
  ### Ombytte voucher til virtuelt kort (wallet)
  ### Betale med gavekort
  ### Betale med voucher
  ### Udløb af gavekort
  ### Saldocheck (gavekort-holder)
  ## Daglig administration (kort)
  ### Overblik over forbrug
  ### Kæde status overblik
  ### Hent transaktionslog til rapportering
  ### Manuelle posteringer
  ### Returnering af voucher/gavekort
  ## Offboarding af kæde
  ### Deaktiver kæde
  ### Luk salgsted(-er)
  ### Luk indløsningssted(-er)
  ### Luk webshop
  ### Luk nummerserie
  ### Opgørelse af indestående
  `
  );

  breakdown = await createNewBreakdown("WBS", project.id);
  await addDataToBreakdown(
    breakdown.id,
    `
  # Milestones
  ## Infrastructure
  ### Kontrakt med Netic underskrevet
  ### Cluster klar til drift
  ## Core platform
  ### Implementation plan aftalt
  ### TUUM deployment on dev cluster done
  ### TUUM klar til CAT
  ### TUUM deployment on prod cluster done
  ## Cardshop
  ## Clarifications
  ### Kontoplan
  ### VISA kort nummer specifikation
  ### Transaktion routing (Nets / VISA / Tuum)
  ### Card authorization (Nets / VISA / Tuum)


  `
  );

  console.log("Seeding complete!");

  log();
}

seed();
