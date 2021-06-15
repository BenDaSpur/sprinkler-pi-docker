<script>
    import {
        Row,
        Col,
        Form,
        FormGroup,
        Label,
        Button,
        ButtonGroup,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        Input,
    } from "sveltestrap";

    export let zonesResponse;
    console.log(zonesResponse);

    import zones from "../zones";
</script>

<Form>
    {#each zones as zone}
        <Row>
            <Col md={8} class="zone-row">
                <Label for="exampleNumber" class="zone-id">
                    {zone.desc} - <span class="text-primary">{zone.id}</span>
                </Label>
                <Input
                    class="zone-minutes"
                    type="number"
                    name="number"
                    id={"zone-" + zone.id}
                    value={zonesResponse[`zone-${zone.id}`]}
                />
            </Col>
        </Row>
    {/each}
</Form>

<style>
    /* float: left; */
    :global(.zone-row) {
        text-align: right;
    }
    :global(.zone-id) {
        margin-right: 1rem;
        margin-top: 0.3rem;
    }
    :global(.zone-minutes) {
        max-width: 5rem;
        float: right;
    }
</style>
